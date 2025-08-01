import { cruise } from "dependency-cruiser"
import { checkSharedComponents } from "./lib/checkSharedComponents.js"
import { formatMessages } from "./lib/formatMessages.js"
import { baseConfigOptions } from "./lib/baseConfigOptions.js"

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

    const sharedComponentMessages = checkSharedComponents(cruiseResult)

    if (sharedComponentMessages.length === 0) {
      console.info("\n✅ No shared component issues found!")
    }

    if (sharedComponentMessages.length > 0) {
      const messages = formatMessages(sharedComponentMessages)
      console.info(messages.join("\n"))
    }
  } catch (pError) {
    console.error(pError)
  }
}
