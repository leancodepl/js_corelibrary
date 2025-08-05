import pc from "picocolors"
import { checkCrossFeatureImports } from "../lib/checkCrossFeatureImports.js"
import { formatMessages } from "../lib/formatMessages.js"
import { CruiseParams, getCruiseResult } from "../lib/getCruiseResult.js"

const { red } = pc

/**
 * Validates cross-feature nested imports according to folder structure rules.
 *
 * This function analyzes the codebase using dependency-cruiser to identify violations
 * of cross-feature import restrictions. It checks if modules with multiple dependents
 * are properly structured to avoid cross-feature nested imports that violate the
 * established folder structure rules.
 *
 * The function will output violations to the console, showing which modules have
 * cross-feature import issues that need to be resolved.
 *
 * @param cruiseParams - Configuration parameters for the dependency analysis
 * @param cruiseParams.directories - Array of directory paths to analyze. Defaults to `[".*"]` if not provided
 * @param cruiseParams.optionsConfigPath - Path to the dependency-cruiser configuration file (e.g., `.dependency-cruiser.js`)
 * @param cruiseParams.tsConfigPath - Optional path to TypeScript configuration file for enhanced type resolution
 *
 * @returns Promise<void> - The function doesn't return a value but outputs results to console
 *
 * @throws {Error} - Throws an error if the dependency analysis fails or configuration is invalid
 *
 * @example
 * ```typescript
 * // Basic usage with default settings
 * await validateCrossFeatureImports({
 *   directories: ["src"],
 *   optionsConfigPath: ".dependency-cruiser.js"
 * });
 *
 * // Advanced usage with TypeScript support
 * await validateCrossFeatureImports({
 *   directories: ["src", "packages"],
 *   optionsConfigPath: ".dependency-cruiser.js",
 *   tsConfigPath: "./tsconfig.json"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using in a build script
 * import { validateCrossFeatureImports } from "@leancodepl/folder-structure-cruiser";
 *
 * try {
 *   await validateCrossFeatureImports({
 *     directories: ["src"],
 *     optionsConfigPath: ".dependency-cruiser.js",
 *     tsConfigPath: "./tsconfig.json"
 *   });
 *   console.log("✅ Cross-feature import validation passed");
 * } catch (error) {
 *   console.error("❌ Cross-feature import validation failed:", error);
 *   process.exit(1);
 * }
 * ```
 */
export async function validateCrossFeatureImports(cruiseParams: CruiseParams) {
  try {
    const cruiseResult = await getCruiseResult(cruiseParams)

    const { messages: errorMessages, totalCruised } = checkCrossFeatureImports(cruiseResult)

    if (errorMessages.length === 0) {
      console.info("\n✅ No issues found!")
    }

    if (errorMessages.length > 0) {
      const messages = formatMessages(errorMessages)
      console.error(messages.join("\n"))
      console.error(`\n${red(`x Found ${errorMessages.length} violations(s). ${totalCruised} modules cruised.`)}`)
    }
  } catch (pError) {
    console.error(pError)
  }
}
