/* eslint-disable no-console */
import { download } from "./download"
import { upload } from "./upload"

export interface SyncCommandOptions {
  srcPattern: string
  outputDir: string
  languages: string[]
  poeditorApiToken: string
  poeditorProjectId: number
  defaultLanguage: string
}

export async function sync(options: SyncCommandOptions): Promise<void> {
  try {
    console.log("Starting sync operation...")

    await upload({
      srcPattern: options.srcPattern,
      poeditorApiToken: options.poeditorApiToken,
      poeditorProjectId: options.poeditorProjectId,
      defaultLanguage: options.defaultLanguage,
    })

    await download({
      outputDir: options.outputDir,
      languages: options.languages,
      poeditorApiToken: options.poeditorApiToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    console.log("Sync completed successfully!")
  } catch (error) {
    console.error("Error in sync command:", error)
    process.exit(1)
  }
}
