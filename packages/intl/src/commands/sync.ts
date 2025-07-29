/* eslint-disable no-console */
import { download } from "./download"
import { upload } from "./upload"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export interface SyncCommandOptions {
  srcPattern: string
  outputDir: string
  languages: string[]
  translationsServiceClient: TranslationsServiceClient
  defaultLanguage: string
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
