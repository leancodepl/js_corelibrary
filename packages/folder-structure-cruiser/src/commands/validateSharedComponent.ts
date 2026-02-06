import { checkSharedComponents } from "../lib/checkSharedComponents.js"
import { formatMessages } from "../lib/formatMessages.js"
import { CruiseParams, getCruiseResult } from "../lib/getCruiseResult.js"
import { logger } from "../lib/logger.js"

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
 * @param cruiseParams.directories - Array of directory paths to analyze. Defaults to [".*"] if not provided
 * @param cruiseParams.configPath - Path to the dependency-cruiser configuration file (e.g., .dependency-cruiser.js)
 * @param cruiseParams.tsConfigPath - Optional path to TypeScript configuration file for enhanced type resolution
 * @param cruiseParams.webpackConfigPath - Optional path to webpack configuration file for webpack alias resolution
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
 *   configPath: ".dependency-cruiser.js",
 *   tsConfigPath: "./tsconfig.base.json"
 * });
 *
 * // Advanced usage with webpack support
 * await validateSharedComponent({
 *   directories: ["src", "packages"],
 *   configPath: ".dependency-cruiser.js",
 *   tsConfigPath: "./tsconfig.base.json",
 *   webpackConfigPath: "./webpack.config.js"
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
 *     configPath: ".dependency-cruiser.js",
 *     tsConfigPath: "./tsconfig.base.json"
 *   });
 *   logger.info("Shared component validation passed");
 * } catch (error) {
 *   logger.error("Shared component validation failed:", error);
 *   process.exit(1);
 * }
 * ```
 */
export async function validateSharedComponent(cruiseParams: CruiseParams) {
  try {
    const cruiseResult = await getCruiseResult(cruiseParams)

    const { messages: infoMessages, totalCruised } = checkSharedComponents(cruiseResult)

    if (infoMessages.length === 0) {
      logger.success("✅ No issues found!")
    }

    if (infoMessages.length > 0) {
      const messages = formatMessages(infoMessages)
      logger.info(messages.join("\n"))
      logger.info(`Found ${infoMessages.length} violations(s). ${totalCruised} modules cruised.`)
    }
  } catch (pError) {
    logger.error(pError as Error)
  }
}
