/* eslint-disable no-console */
import { mkdirSync } from "fs"
import { compileTranslations, createTranslationsTempDir, writeTranslationsToTempDir } from "../formatjs"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export interface DownloadCommandOptions {
  outputDir: string
  languages: string[]
  translationsServiceClient: TranslationsServiceClient
}

export async function download({ outputDir, languages, translationsServiceClient }: DownloadCommandOptions) {
  try {
    console.log("Starting download from translation service...")

    console.log(`Downloading translations for languages: ${languages.join(", ")}`)

    const tempDir = createTranslationsTempDir("download-")

    try {
      for (const language of languages) {
        console.log(`Downloading ${language} translations...`)

        const translations = await translationsServiceClient.downloadTranslations(language)
        writeTranslationsToTempDir({ translations, language, tempDir })

        const translationCount = Object.keys(translations).length
        console.log(`Downloaded ${translationCount} translations for ${language}`)
      }

      console.log("Compiling translations...")

      mkdirSync(outputDir, { recursive: true })

      await compileTranslations({ inputDir: tempDir, outputDir })

      console.log(`Compiled translations saved to ${outputDir}`)
    } finally {
      const { rmSync } = await import("fs")
      rmSync(tempDir, { recursive: true, force: true })
    }
  } catch (error) {
    console.error("Error in download command:", error)
    process.exit(1)
  }
}
