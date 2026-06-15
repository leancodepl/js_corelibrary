import { IReporterOutput } from "dependency-cruiser"
import { CheckResult } from "./checkResult"
import { Message } from "./formatMessages"

/**
 * Collects the violations of the built-in `no-orphans` rule found while
 * cruising — modules that nothing imports and that import nothing themselves.
 */
export function checkOrphans(result: IReporterOutput): CheckResult {
  const output = typeof result.output === "object" ? result.output : undefined
  const violations = output?.summary.violations ?? []

  const messages: Message[] = violations.map(violation => ({
    source: violation.from,
    target: violation.to,
    rule: violation.rule.name,
    severity: violation.rule.severity === "info" ? "info" : "error",
  }))

  return {
    messages,
    totalCruised: output?.summary.totalCruised ?? 0,
  }
}
