import React from "react"
import { Box, render, Text } from "ink"
import { checkCrossFeatureImports } from "../lib/checkCrossFeatureImports.js"
import { formatMessages, Message } from "../lib/formatMessages.js"
import { CruiseParams, getCruiseResult } from "../lib/getCruiseResult.js"

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
 * await validateCrossFeatureImports({
 *   directories: ["src"],
 *   configPath: ".dependency-cruiser.js",
 *   tsConfigPath: "./tsconfig.base.json"
 * });
 *
 * // Advanced usage with webpack support
 * await validateCrossFeatureImports({
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
 * import { validateCrossFeatureImports } from "@leancodepl/folder-structure-cruiser";
 *
 * try {
 *   await validateCrossFeatureImports({
 *     directories: ["src"],
 *     configPath: ".dependency-cruiser.js",
 *     tsConfigPath: "./tsconfig.base.json"
 *   });
 *   console.log("✅ Cross-feature import validation passed");
 * } catch (error) {
 *   console.error("❌ Cross-feature import validation failed:", error);
 *   process.exit(1);
 * }
 * ```
 */
interface ValidationResultProps {
  errorMessages: Message[]
  totalCruised: number
}

const ValidationResult: React.FC<ValidationResultProps> = ({ errorMessages, totalCruised }) => {
  if (errorMessages.length === 0) {
    return (
      <Box flexDirection="column">
        <Text color="green">✅ No issues found!</Text>
      </Box>
    )
  }

  const messages = formatMessages(errorMessages)

  return (
    <Box flexDirection="column">
      {messages.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
      <Text color="red">{`\nx Found ${errorMessages.length} violations(s). ${totalCruised} modules cruised.`}</Text>
    </Box>
  )
}

export async function validateCrossFeatureImports(cruiseParams: CruiseParams) {
  try {
    const cruiseResult = await getCruiseResult(cruiseParams)

    const { messages: errorMessages, totalCruised } = checkCrossFeatureImports(cruiseResult)

    render(<ValidationResult errorMessages={errorMessages} totalCruised={totalCruised} />)
  } catch (pError) {
    console.error(pError)
  }
}
