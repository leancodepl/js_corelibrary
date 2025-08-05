import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefix, findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message } from "./formatMessages.js"

type CheckResult = { messages: Message[]; dependentsLength: number; modulesLength: number }

/**
 * Checks if an index file is properly positioned within its containing folder
 */
function isIndexFileProperlyPositioned(
  pathParts: string[],
  commonDependentPrefix: string[],
  commonPrefixLength: number,
) {
  const fileName = pathParts[pathParts.length - 1]

  if (!/index\.(tsx?|jsx?|ts|js)$/.test(fileName)) {
    return false
  }

  const parentFolder = pathParts[pathParts.length - 3]
  const expectedParentFolder = commonDependentPrefix[commonDependentPrefix.length - 1]

  return parentFolder === expectedParentFolder && commonPrefixLength === pathParts.length - 2
}

/**
 * Checks for components that should be moved to shared level based on dependent patterns
 */
export function checkSharedComponents(result: IReporterOutput): CheckResult {
  const modules = typeof result.output === "object" ? result.output.modules : []
  const infoMessages: Message[] = []

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependents = module.dependents || []

    // Only check modules with multiple dependents
    if (dependents.length <= 1) {
      continue
    }

    const pathParts = module.source.split("/")

    // Skip if already at first level (depth <= 2)
    if (pathParts.length <= 2) {
      continue
    }

    // Find the common path among all dependents
    const dependentPathParts = dependents.map(dep => dep.split("/"))
    const commonDependentPrefix = findCommonPathsPrefix(dependentPathParts)

    // Find the common prefix between source and the common dependent path
    const commonPrefixLength = findCommonPathsPrefixLength([pathParts, commonDependentPrefix])

    // Skip properly positioned index files
    if (isIndexFileProperlyPositioned(pathParts, commonDependentPrefix, commonPrefixLength)) {
      continue
    }

    // Check if component should be moved to shared level
    if (commonPrefixLength < pathParts.length - 1) {
      infoMessages.push({
        source: module.source,
        target: commonDependentPrefix.join("/"),
        rule: "not-shared-level",
        severity: "info",
      })
    }
  }

  const dependentsCount = modules.reduce((acc, module) => acc + (module.dependents ? module.dependents.length : 0), 0)

  return { messages: infoMessages, modulesLength: modules.length, dependentsLength: dependentsCount }
}
