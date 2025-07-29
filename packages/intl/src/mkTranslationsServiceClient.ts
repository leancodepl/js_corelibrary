import { POEditorClient } from "./poeditor/POEditorClient"
import type { TranslationsServiceClient } from "./TranslationsServiceClient"

export type TranslationsService = "poeditor"

export function mkTranslationsServiceClient({
  config,
  provider = "poeditor",
}: {
  config: { poeditorApiToken?: string; poeditorProjectId: number }
  provider?: TranslationsService
}): TranslationsServiceClient {
  switch (provider) {
    case "poeditor":
      if (!config.poeditorApiToken || !config.poeditorProjectId) {
        throw new Error("POEditor API token and project ID are required")
      }

      return new POEditorClient({
        poeditorApiToken: config.poeditorApiToken,
        poeditorProjectId: config.poeditorProjectId,
      })
    default:
      throw new Error(`Unsupported translations service: ${provider}`)
  }
}
