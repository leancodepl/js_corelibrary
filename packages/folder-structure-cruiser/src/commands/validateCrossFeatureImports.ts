import { checkCrossFeatureImports } from "../lib/checkCrossFeatureImports"
import { getCruiseResult } from "../lib/getCruiseResult"
import { loadConfig } from "../lib/loadConfig"
import { reportViolations } from "../lib/reportViolations"
import { ValidateParams } from "../lib/validateParams"

/**
 * Validates cross-feature nested imports according to folder structure rules.
 *
 * Analyzes the module graph of the given directories and reports imports that
 * reach into another feature deeper than its immediate children, unless the
 * imported path is a direct child of one of the configured
 * `crossFeatureImports.allowedRoutes`. Modules matching the config's `ignore`
 * or `crossFeatureImports.ignore` patterns are left out of the analysis.
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
 * import { validateCrossFeatureImports } from "@leancodepl/folder-structure-cruiser";
 *
 * const violations = await validateCrossFeatureImports({
 *   directories: ["src"],
 *   configPath: "./folder-structure-cruiser.config.json",
 * });
 * ```
 */
export async function validateCrossFeatureImports({ directories, configPath }: ValidateParams): Promise<number> {
  const config = await loadConfig(configPath)

  const cruiseResult = await getCruiseResult({
    directories,
    config,
    command: "crossFeatureImports",
  })

  return reportViolations(checkCrossFeatureImports(cruiseResult))
}
