import { cruise } from "dependency-cruiser"
import { baseConfigOptions } from "../lib/baseConfigOptions.js"
import { checkSharedComponents } from "../lib/checkSharedComponents.js"
import { formatMessages } from "../lib/formatMessages.js"

/**
 * Validates if shared components are located at the first shared level.
 * Analyzes the codebase using dependency-cruiser to identify components that should be moved to shared levels.
 *
 * @param directories - Directories to analyze for shared component issues
 * @param excludePaths - Paths to exclude from analysis
 * @param tsConfigPath - Optional path to TypeScript configuration file
 * @example
 * ```typescript
 * await validateSharedComponent({
 *   directories: ["src"],
 *   excludePaths: ["__tests__"],
 *   tsConfigPath: "./tsconfig.json"
 * });
 * ```
 */
export async function validateSharedComponent({
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

    const { messages: infoMessages, modulesLength, dependentsLength } = checkSharedComponents(cruiseResult)

    if (infoMessages.length === 0) {
      console.info("\n✅ No shared component issues found!")
    }

    if (infoMessages.length > 0) {
      const messages = formatMessages(infoMessages)
      console.info(messages.join("\n"))
      console.info(
        `\nx Found ${infoMessages.length} violations(s). ${modulesLength} modules, ${dependentsLength} dependencies cruised.`,
      )
    }
  } catch (pError) {
    console.error(pError)
  }
}
