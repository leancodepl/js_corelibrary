/* eslint-disable no-console */
import { mkdirSync } from "fs"
import { compileTranslations, createTranslationsTempDir, writeTranslationsToTempDir } from "../formatjs"
import { mkTranslationsServiceClient } from "../mkTranslationsServiceClient"

export interface DownloadCommandOptions {
  outputDir: string
  languages: string[]
  poeditorApiToken: string
  poeditorProjectId: number
}

export async function download(options: DownloadCommandOptions): Promise<void> {
  try {
    console.log("Starting download from POEditor...")

    console.log(`Downloading translations for languages: ${options.languages.join(", ")}`)

    const client = mkTranslationsServiceClient({
      poeditorApiToken: options.poeditorApiToken,
      poeditorProjectId: options.poeditorProjectId,
    })
    const tempDir = createTranslationsTempDir("download-")

    try {
      for (const language of options.languages) {
        console.log(`Downloading ${language} translations...`)

        const translations = await client.downloadTranslations(language)
        writeTranslationsToTempDir(translations, language, tempDir)

        const translationCount = Object.keys(translations).length
        console.log(`Downloaded ${translationCount} translations for ${language}`)
      }

      console.log("Compiling translations...")

      mkdirSync(options.outputDir, { recursive: true })

      await compileTranslations(tempDir, options.outputDir)

      console.log(`Compiled translations saved to ${options.outputDir}`)
    } finally {
      const { rmSync } = await import("fs")
      rmSync(tempDir, { recursive: true, force: true })
    }
  } catch (error) {
    console.error("Error in download command:", error)
    process.exit(1)
  }
}
