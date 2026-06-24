import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import { logger } from "../logger"
import { download } from "./download"
import { upload } from "./upload"

export const syncCommandOptionsSchema = z.object({
  srcPattern: z.string(),
  outputDir: z.string(),
  languages: z.array(z.string()),
  defaultLanguage: z.string(),
})

export type SyncCommandOptions = z.infer<typeof syncCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function sync({
  srcPattern,
  outputDir,
  languages,
  translationsServiceClient,
  defaultLanguage,
}: SyncCommandOptions) {
  logger.info("Starting sync operation...")

  await upload({
    srcPattern,
    translationsServiceClient,
    defaultLanguage,
  })

  await download({
    outputDir,
    languages,
    translationsServiceClient,
  })

  logger.success("Sync completed successfully!")
}
