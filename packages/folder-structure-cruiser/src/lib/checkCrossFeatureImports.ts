import { IReporterOutput } from "dependency-cruiser"
import { CheckResult } from "./checkResult"
import { findCommonPathsPrefixLength } from "./findCommonPathsPrefix"
import { Message } from "./formatMessages"

export function checkCrossFeatureImports(result: IReporterOutput): CheckResult {
  const output = typeof result.output === "object" ? result.output : undefined
  const modules = output?.modules ?? []

  const errorMessages: Message[] = []

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependencies = module.dependencies || []

    const modulePath = module.source.split("/")

    dependencies.forEach(dependency => {
      if (isExternalDependency(dependency.dependencyTypes)) {
        return
      }

      const dependencyPath = dependency.resolved.split("/")
      const commonPrefixPathLength = findCommonPathsPrefixLength([modulePath, dependencyPath])

      if (
        !commonPrefixPathLength ||
        (commonPrefixPathLength < modulePath.length && dependencyPath.length > commonPrefixPathLength + 2)
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

function isExternalDependency(dependencyTypes: string[] | undefined): boolean {
  return dependencyTypes?.some(type => type === "core" || type === "unknown" || type.startsWith("npm")) ?? false
}
