import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message } from "./formatMessages.js"

type CheckResult = { messages: Message[]; totalCruised: number }
type CheckCrossFeatureImportsOptions = {
  allowImportsFromDirectChildrenOf?: string[]
}

const INDEX_FILE_PATTERN = /^index(?:\..+)?$/

function normalizePath(path: string): string[] {
  return path.split("/").filter(segment => segment.length > 0 && segment !== ".")
}

function findSubPathIndex(path: string[], subPath: string[]): number {
  if (subPath.length === 0 || path.length < subPath.length) {
    return -1
  }

  for (let i = 0; i <= path.length - subPath.length; i++) {
    const isMatch = subPath.every((segment, offset) => path[i + offset] === segment)

    if (isMatch) {
      return i
    }
  }

  return -1
}

function isDirectChildImportOfDirectory(dependencyPath: string[], directoryPath: string[]): boolean {
  const directoryPathStartIndex = findSubPathIndex(dependencyPath, directoryPath)

  if (directoryPathStartIndex < 0) {
    return false
  }

  const relativePathFromDirectory = dependencyPath.slice(directoryPathStartIndex + directoryPath.length)

  if (relativePathFromDirectory.length === 1) {
    return true
  }

  return relativePathFromDirectory.length === 2 && INDEX_FILE_PATTERN.test(relativePathFromDirectory[1])
}

export function checkCrossFeatureImports(
  result: IReporterOutput,
  options: CheckCrossFeatureImportsOptions = {},
): CheckResult {
  const output = typeof result.output === "object" ? result.output : undefined
  const modules = output?.modules ?? []
  const allowedDirectChildrenDirectories = (options.allowImportsFromDirectChildrenOf ?? []).map(normalizePath)

  const errorMessages: Message[] = []

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependencies = module.dependencies || []

    const modulePath = module.source.split("/")

    dependencies.forEach(dependency => {
      const dependencyPath = dependency.resolved.split("/")
      const commonPrefixPathLength = findCommonPathsPrefixLength([modulePath, dependencyPath])
      const shouldAllowDirectChildrenImport = allowedDirectChildrenDirectories.some(directoryPath =>
        isDirectChildImportOfDirectory(dependencyPath, directoryPath),
      )

      if (
        !shouldAllowDirectChildrenImport &&
        (!commonPrefixPathLength ||
          (commonPrefixPathLength < modulePath.length && dependencyPath.length > commonPrefixPathLength + 2))
      ) {
        errorMessages.push({
          source: module.source,
          target: dependency.resolved,
          rule: "cross-feature-nested-imports",
          severity: "error",
        })
      }
    })
  }

  return {
    messages: errorMessages,
    totalCruised: output?.summary.totalCruised ?? 0,
  }
}
