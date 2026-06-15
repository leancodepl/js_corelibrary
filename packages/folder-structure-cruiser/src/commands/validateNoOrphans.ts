import { IForbiddenRuleType } from "dependency-cruiser"
import { checkOrphans } from "../lib/checkOrphans"
import { getCruiseResult } from "../lib/getCruiseResult"
import { loadConfig } from "../lib/loadConfig"
import { reportViolations } from "../lib/reportViolations"
import { ValidateParams } from "../lib/validateParams"

/**
 * Validates that no orphaned modules exist — files that nothing imports and
 * that import nothing themselves.
 *
 * Modules matching the config's `ignore` or `noOrphans.ignore` patterns are
 * left out of the analysis.
 *
 * Violations are logged to the console.
 *
 * @param params - See {@link ValidateParams}
 *
 * @returns Promise<number> - Number of detected violations
 *
 * @throws {Error} - Throws an error if the analysis fails or the config is invalid
 *
 * @example
 * ```typescript
 * import { validateNoOrphans } from "@leancodepl/folder-structure-cruiser";
 *
 * const violations = await validateNoOrphans({
 *   directories: ["src"],
 *   configPath: "./folder-structure-cruiser.config.json",
 * });
 * ```
 */
export async function validateNoOrphans({ directories, configPath }: ValidateParams): Promise<number> {
  const config = await loadConfig(configPath)

  const cruiseResult = await getCruiseResult({
    directories,
    config,
    command: "noOrphans",
    ruleSet: { forbidden: [noOrphansRule] },
  })

  return reportViolations(checkOrphans(cruiseResult))
}

const noOrphansRule: IForbiddenRuleType = {
  name: "no-orphans",
  from: { orphan: true },
  to: {},
}
