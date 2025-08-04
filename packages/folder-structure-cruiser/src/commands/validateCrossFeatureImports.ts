import { cruise } from "dependency-cruiser"
import pc from "picocolors"
import { baseConfigOptions } from "../lib/baseConfigOptions.js"
import { checkCrossFeatureImports } from "../lib/checkCrossFeatureImports.js"
import { formatMessages } from "../lib/formatMessages.js"

const { red } = pc

/**
 * Validates if cross-feature nested imports are allowed according to folder structure rules.
 * Analyzes the codebase using dependency-cruiser to identify violations of cross-feature import restrictions.
 *
 * @param directories - Directories to analyze for cross-feature import violations
 * @param excludePaths - Paths to exclude from analysis
 * @param tsConfigPath - Optional path to TypeScript configuration file
 * @example
 * ```typescript
 * await validateCrossFeatureImports({
 *   directories: ["src"],
 *   excludePaths: ["__tests__"],
 *   tsConfigPath: "./tsconfig.json"
 * });
 * ```
 */
export async function validateCrossFeatureImports({
  directories = [".*"],
  excludePaths = [],
  tsConfigPath,
}: {
  directories: string[]
  excludePaths: string[]
  tsConfigPath?: string
}) {
  try {
    const cruiseResult = await cruise(directories, {
      ...baseConfigOptions,
      tsConfig: { fileName: tsConfigPath },
      doNotFollow: {
        path: "node_modules",
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
      exclude: {
        path: ["node_modules", ...excludePaths],
      },
    })

    const { messages: errorMessages, modulesLength, dependentsLength } = checkCrossFeatureImports(cruiseResult)

    if (errorMessages.length === 0) {
      console.info("\n✅ No cross feature imports issues found!")
    }

    if (errorMessages.length > 0) {
      const messages = formatMessages(errorMessages)
      console.error(messages.join("\n"))
      console.error(
        `\n${red(`x Found ${errorMessages.length} violations(s). ${modulesLength} modules, ${dependentsLength} dependencies cruised.`)}`,
      )
    }
  } catch (pError) {
    console.error(pError)
  }
}
