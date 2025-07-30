import { POEditorClient } from "./poeditor/POEditorClient"
import type { TranslationsServiceClient } from "./TranslationsServiceClient"

export type TranslationsService = "poeditor"

export function mkTranslationsServiceClient({
  config,
  service = "poeditor",
}: {
  config: { poeditorApiToken?: string; poeditorProjectId?: number }
  service?: TranslationsService
}): TranslationsServiceClient {
  switch (service) {
    case "poeditor":
      if (!config.poeditorApiToken || !config.poeditorProjectId) {
        throw new Error("POEditor API token and project ID are required")
      }

      return new POEditorClient({
        apiToken: config.poeditorApiToken,
        projectId: config.poeditorProjectId,
      })
    default:
      throw new Error(`Unsupported translations service: ${service}`)
  }
}
