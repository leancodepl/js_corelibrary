import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message } from "./formatMessages.js"
import { stripOpaqueSegments } from "./opaqueSegments.js"

type CheckResult = { messages: Message[]; totalCruised: number }

export function checkCrossFeatureImports(result: IReporterOutput): CheckResult {
  const output = typeof result.output === "object" ? result.output : undefined
  const modules = output?.modules ?? []

  const errorMessages: Message[] = []

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependencies = module.dependencies || []

    const modulePath = stripOpaqueSegments(module.source.split("/"))

    dependencies.forEach(dependency => {
      if (isExternalDependency(dependency.dependencyTypes)) {
        return
      }

      const dependencyPath = stripOpaqueSegments(dependency.resolved.split("/"))
      const commonPrefixPathLength = findCommonPathsPrefixLength([modulePath, dependencyPath])

      if (
        !commonPrefixPathLength ||
        (commonPrefixPathLength < modulePath.length &&
          dependencyPath.length > commonPrefixPathLength + maxNestedImportDepth)
      ) {
        errorMessages.push({
          rule: "cross-feature-nested-imports",
          severity: "error",
          importer: module.source,
          imported: dependency.resolved,
        })
      }
    })
  }

  return {
    messages: errorMessages,
    totalCruised: output?.summary.totalCruised ?? 0,
  }
}

const maxNestedImportDepth = 2

function isExternalDependency(dependencyTypes: string[] | undefined): boolean {
  return dependencyTypes?.some(type => type === "core" || type === "unknown" || type.startsWith("npm")) ?? false
}
