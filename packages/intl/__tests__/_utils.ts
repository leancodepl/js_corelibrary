import { mkTranslationsServiceClient } from "../src"

export function getTranslationsServiceClient() {
  const poeditorApiToken = process.env["POEDITOR_API_TOKEN"]
  const poeditorProjectId = process.env["POEDITOR_PROJECT_ID"]

  if (!poeditorApiToken || !poeditorProjectId) {
    console.log("Skipping test - no POEditor credentials provided")
    return undefined
  }

  return mkTranslationsServiceClient({
    config: {
      poeditorApiToken,
      poeditorProjectId: parseInt(poeditorProjectId, 10),
    },
  })
}
