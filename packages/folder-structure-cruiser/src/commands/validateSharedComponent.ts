import { checkSharedComponents } from "../lib/checkSharedComponents"
import { getCruiseResult } from "../lib/getCruiseResult"
import { loadConfig } from "../lib/loadConfig"
import { reportViolations } from "../lib/reportViolations"
import { ValidateParams } from "../lib/validateParams"

/**
 * Validates if shared components are located at the first shared level.
 *
 * Analyzes the module graph of the given directories and reports components
 * that are used across multiple features but are not placed at the first level
 * shared by their dependents. Modules matching the config's `ignore` or
 * `sharedComponents.ignore` patterns are left out of the analysis.
 *
 * Recommendations are logged to the console.
 *
 * @param params - See {@link ValidateParams}
 *
 * @returns Promise<number> - Number of detected violations
 *
 * @throws {Error} - Throws an error if the analysis fails or the config is invalid
 *
 * @example
 * ```typescript
 * import { validateSharedComponent } from "@leancodepl/folder-structure-cruiser";
 *
 * const violations = await validateSharedComponent({
 *   directories: ["src"],
 *   configPath: "./folder-structure-cruiser.config.json",
 * });
 * ```
 */
export async function validateSharedComponent({ directories, configPath }: ValidateParams): Promise<number> {
  const config = await loadConfig(configPath)

  const cruiseResult = await getCruiseResult({
    directories,
    config,
    command: "sharedComponents",
  })

  return reportViolations(checkSharedComponents(cruiseResult))
}
