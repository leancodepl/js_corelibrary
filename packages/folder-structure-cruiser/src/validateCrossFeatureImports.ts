import { cruise } from "dependency-cruiser"
import pc from "picocolors"
import { baseConfigOptions } from "./lib/baseConfigOptions.js"
import { checkCrossFeatureImports } from "./lib/checkCrossFeatureImports.js"
import { formatMessages } from "./lib/formatMessages.js"

const { red } = pc

export async function validateCrossFeatureImports(directories: string[] = [".*"], excludePaths: string[] = []) {
  try {
    const cruiseResult = await cruise(directories, {
      ...baseConfigOptions,
      doNotFollow: {
        path: "node_modules",
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
      exclude: {
        path: ["node_modules", ...excludePaths],
      },
    })

    const errorMessages = checkCrossFeatureImports(cruiseResult)

    if (errorMessages.length === 0) {
      console.info("\n✅ No cross feature imports issues found!")
    }

    if (errorMessages.length > 0) {
      const messages = formatMessages(errorMessages)
      console.error(messages.join("\n"))
      console.error(`\n${red(`x Found ${errorMessages.length} violations(s)`)}`)
    }
  } catch (pError) {
    console.error(pError)
  }
}
