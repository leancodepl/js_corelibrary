/* eslint-disable no-console */
import { z } from "zod/v4"
import { download } from "./download"
import { upload } from "./upload"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

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
  try {
    console.log("Starting sync operation...")

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

    console.log("Sync completed successfully!")
  } catch (error) {
    console.error("Error in sync command:", error)
    process.exit(1)
  }
}
