import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message } from "./formatMessages.js"

type CheckResult = { messages: Message[]; dependentsLength: number; modulesLength: number }

/**
 * Checks for cross-feature imports that violate folder structure rules
 */
export function checkCrossFeatureImports(result: IReporterOutput): CheckResult {
  const modules = typeof result.output === "object" ? result.output.modules : []
  const errorMessages: Message[] = []

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependents = module.dependents || []

    // Only check modules with multiple dependents
    if (dependents.length <= 1) {
      continue
    }

    const modulePath = module.source.split("/")

    // Skip if already at first level (depth <= 2)
    if (modulePath.length <= 2) {
      continue
    }

    // Check each dependent
    dependents.forEach(dependent => {
      const dependentPath = dependent.split("/")
      const commonPrefixPathLength = findCommonPathsPrefixLength([modulePath, dependentPath])

      if (
        !commonPrefixPathLength ||
        (commonPrefixPathLength > 1 &&
          commonPrefixPathLength < modulePath.length &&
          dependentPath.length !== commonPrefixPathLength - 1)
      ) {
        errorMessages.push({
          source: module.source,
          target: dependent,
          rule: "cross-feature-nested-imports",
          severity: "error",
        })
      }
    })
  }

  const dependentsCount = modules.reduce((acc, module) => acc + (module.dependents ? module.dependents.length : 0), 0)

  return { messages: errorMessages, modulesLength: modules.length, dependentsLength: dependentsCount }
}
