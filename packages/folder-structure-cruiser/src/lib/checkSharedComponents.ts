import { IReporterOutput } from "dependency-cruiser"
import { findCommonPathsPrefix, findCommonPathsPrefixLength } from "./findCommonPathsPrefix.js"
import { Message } from "./formatMessages.js"

type CheckResult = { messages: Message[]; totalCruised: number }

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

  for (const module of modules) {
    if (module.coreModule) {
      continue
    }

    const dependents = module.dependents || []

    if (dependents.length <= 1) {
      continue
    }

    const pathParts = module.source.split("/")
    const pathPartsLength = pathParts.length

    if (pathPartsLength <= 2) {
      continue
    }

    const dependentPathParts = dependents.map(dep => dep.split("/"))
    const commonDependentPrefix = findCommonPathsPrefix(dependentPathParts)

    const commonPrefixLength = findCommonPathsPrefixLength([pathParts, commonDependentPrefix])

    if (isIndexFileProperlyPositioned(pathParts, commonDependentPrefix, commonPrefixLength)) {
      continue
    }

    if (commonPrefixLength < pathPartsLength - 1) {
      infoMessages.push({
        source: module.source,
        target: commonDependentPrefix.join("/"),
        rule: "not-shared-level",
        severity: "info",
      })
    }
  }

  return {
    messages: infoMessages,
    totalCruised: output?.summary.totalCruised ?? 0,
  }
}
