import type { TranslationsServiceClient } from "./TranslationsServiceClient"
import { POEditorClient } from "./poeditor/POEditorClient"

export function mkTranslationsServiceClient({
  poeditorApiToken,
  poeditorProjectId,
}: {
  poeditorApiToken?: string
  poeditorProjectId?: number
}): TranslationsServiceClient {
  if (!!poeditorApiToken && !!poeditorProjectId) {
    return new POEditorClient({
      apiToken: poeditorApiToken,
      projectId: poeditorProjectId,
    })
  }

  throw new Error("No configuration for translations service client provided.")
}
