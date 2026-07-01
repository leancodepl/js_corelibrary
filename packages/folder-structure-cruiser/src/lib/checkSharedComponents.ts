import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefix, findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message, NotSharedLevelRemedy } from "./formatMessages.js"
import { stripOpaqueSegments } from "./opaqueSegments.js"

type CheckResult = { messages: Message[]; totalCruised: number }

const barrelNames = ["index.ts", "index.tsx", "index.js", "index.jsx"]

function dirOf(path: string): string {
  return path.split("/").slice(0, -1).join("/")
}

function isBarrelPath(path: string): boolean {
  return barrelNames.includes(path.split("/").at(-1) ?? "")
}

/**
 * The barrel that re-exports a folder's members, if the folder has one. A
 * `componentDir` of `app/lib` resolves to `app/lib/index.ts` (or `.tsx` etc.)
 * when such a module was cruised.
 */
function findBarrel(componentDir: string, moduleSources: Set<string>): string | null {
  return barrelNames.map(name => `${componentDir}/${name}`).find(path => moduleSources.has(path)) ?? null
}

/**
 * The deepest barrel dependent that re-exports the component from at or above
 * its own folder. This covers both the component's own-folder barrel and an
 * ancestor barrel that re-exports it through descendants (e.g. `lib/index.ts`
 * doing `export * from "./search/results"`), which is the entry point the
 * outside importers should go through. The deepest one wins because it is the
 * most specific re-export already in place.
 */
function findReExportingBarrel(component: string, dependents: string[]): string | null {
  return (
    dependents
      .filter(dependent => isBarrelPath(dependent) && component.startsWith(`${dirOf(dependent)}/`))
      .toSorted((a, b) => dirOf(b).split("/").length - dirOf(a).split("/").length)[0] ?? null
  )
}

/**
 * A component reached from inside its own folder (a sibling or its barrel) or
 * re-exported by a barrel above it is a cohesive member of that subtree; the
 * violation is then that some importers reach past the barrel, so the fix is to
 * route them through it rather than to move the file.
 */
function resolveRemedy(component: string, dependents: string[], moduleSources: Set<string>): NotSharedLevelRemedy {
  const reExportingBarrel = findReExportingBarrel(component, dependents)
  if (reExportingBarrel) {
    return { kind: "use-barrel", barrel: reExportingBarrel }
  }

  const componentDir = dirOf(component)
  if (dependents.some(dependent => dependent.startsWith(`${componentDir}/`))) {
    return { kind: "use-barrel", barrel: findBarrel(componentDir, moduleSources) }
  }

  return { kind: "move", suggestedLocation: findCommonPathsPrefix(dependents.map(dep => dep.split("/"))).join("/") }
}

function isIndexFileProperlyPositioned(
  pathParts: string[],
  commonDependentPrefix: string[],
  commonPrefixLength: number,
) {
  const fileName = pathParts.at(-1) ?? ""

  if (!/index\.(tsx?|jsx?|ts|js)$/.test(fileName)) {
    return false
  }

  const parentFolder = pathParts.at(-3) ?? ""
  const expectedParentFolder = commonDependentPrefix.at(-1)

  return parentFolder === expectedParentFolder && commonPrefixLength === pathParts.length - 2
}

export function checkSharedComponents(result: IReporterOutput): CheckResult {
  const output = typeof result.output === "object" ? result.output : undefined
  const modules = output?.modules ?? []
  const infoMessages: Message[] = []
  const moduleSources = new Set(modules.map(module => module.source))

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependents = module.dependents || []

    if (dependents.length <= 1) {
      continue
    }

    const pathParts = stripOpaqueSegments(module.source.split("/"))
    const pathPartsLength = pathParts.length

    if (pathPartsLength <= 2) {
      continue
    }

    const dependentPathParts = dependents.map(dep => stripOpaqueSegments(dep.split("/")))
    const commonDependentPrefix = findCommonPathsPrefix(dependentPathParts)

    const commonPrefixLength = findCommonPathsPrefixLength([pathParts, commonDependentPrefix])

    if (isIndexFileProperlyPositioned(pathParts, commonDependentPrefix, commonPrefixLength)) {
      continue
    }

    if (commonPrefixLength < pathPartsLength - 1) {
      infoMessages.push({
        rule: "not-shared-level",
        severity: "info",
        component: module.source,
        dependents,
        remedy: resolveRemedy(module.source, dependents, moduleSources),
      })
    }
  }

  return {
    messages: infoMessages,
    totalCruised: output?.summary.totalCruised ?? 0,
  }
}
