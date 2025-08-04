import { cruise } from "dependency-cruiser"
import { baseConfigOptions } from "./lib/baseConfigOptions.js"
import { checkSharedComponents } from "./lib/checkSharedComponents.js"
import { formatMessages } from "./lib/formatMessages.js"

export async function validateSharedComponent(directories: string[] = [".*"], excludePaths: string[] = []) {
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

    const infoMessages = checkSharedComponents(cruiseResult)

    if (infoMessages.length === 0) {
      console.info("\n✅ No shared component issues found!")
    }

    if (infoMessages.length > 0) {
      const messages = formatMessages(infoMessages)
      console.info(messages.join("\n"))
      console.info(`\nx Found ${infoMessages.length} violations(s)`)
    }
  } catch (pError) {
    console.error(pError)
  }
}
