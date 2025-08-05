import { checkSharedComponents } from "../lib/checkSharedComponents.js"
import { formatMessages } from "../lib/formatMessages.js"
import { CruiseParams, getCruiseResult } from "../lib/getCruiseResult.js"

/**
 * Validates if shared components are located at the first shared level.
 *
 * This function analyzes the codebase using dependency-cruiser to identify components
 * that should be moved to shared levels. It checks if components that are used across
 * multiple features are properly placed at the appropriate shared level in the folder
 * structure, following the established architectural patterns.
 *
 * The function will output recommendations to the console, showing which components
 * should be moved to shared levels for better code organization and reusability.
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
 * await validateSharedComponent({
 *   directories: ["src"],
 *   optionsConfigPath: ".dependency-cruiser.js"
 * });
 *
 * // Advanced usage with TypeScript support
 * await validateSharedComponent({
 *   directories: ["src", "packages"],
 *   optionsConfigPath: ".dependency-cruiser.js",
 *   tsConfigPath: "./tsconfig.json"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using in a build script
 * import { validateSharedComponent } from "@leancodepl/folder-structure-cruiser";
 *
 * try {
 *   await validateSharedComponent({
 *     directories: ["src"],
 *     optionsConfigPath: ".dependency-cruiser.js",
 *     tsConfigPath: "./tsconfig.json"
 *   });
 *   console.log("✅ Shared component validation passed");
 * } catch (error) {
 *   console.error("❌ Shared component validation failed:", error);
 *   process.exit(1);
 * }
 * ```
 */
export async function validateSharedComponent(cruiseParams: CruiseParams) {
  try {
    const cruiseResult = await getCruiseResult(cruiseParams)

    const { messages: infoMessages, totalCruised } = checkSharedComponents(cruiseResult)

    if (infoMessages.length === 0) {
      console.info("\n✅ No issues found!")
    }

    if (infoMessages.length > 0) {
      const messages = formatMessages(infoMessages)
      console.info(messages.join("\n"))
      console.info(`\nx Found ${infoMessages.length} violations(s). ${totalCruised} modules cruised.`)
    }
  } catch (pError) {
    console.error(pError)
  }
}
