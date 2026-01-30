import { mkdirSync, rmSync } from "node:fs"
import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import { compileTranslations, createTranslationsTempDir, writeTranslationsToTempDir } from "../formatjs"

export const downloadCommandOptionsSchema = z.object({
  outputDir: z.string(),
  languages: z.array(z.string()),
})

export type DownloadCommandOptions = z.infer<typeof downloadCommandOptionsSchema> & {
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

      compileTranslations({ inputDir: tempDir, outputDir })

      console.log(`Compiled translations saved to ${outputDir}`)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  } catch (error) {
    console.error("Error in download command:", error)
    process.exit(1)
  }
}
