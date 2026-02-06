import { mkdirSync, rmSync } from "node:fs"
import { z } from "zod/v4"
import { compileTranslations, createTranslationsTempDir, writeTranslationsToTempDir } from "../formatjs"
import { logger } from "../logger"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export const downloadCommandOptionsSchema = z.object({
  outputDir: z.string(),
  languages: z.array(z.string()),
})

export type DownloadCommandOptions = z.infer<typeof downloadCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function download({ outputDir, languages, translationsServiceClient }: DownloadCommandOptions) {
  try {
    logger.info("Starting download from translation service...")

    logger.info(`Downloading translations for languages: ${languages.join(", ")}`)

    const tempDir = createTranslationsTempDir("download-")

    try {
      for (const language of languages) {
        logger.info(`Downloading ${language} translations...`)

        const translations = await translationsServiceClient.downloadTranslations(language)
        writeTranslationsToTempDir({ translations, language, tempDir })

        const translationCount = Object.keys(translations).length
        logger.info(`Downloaded ${translationCount} translations for ${language}`)
      }

      logger.info("Compiling translations...")

      mkdirSync(outputDir, { recursive: true })

      compileTranslations({ inputDir: tempDir, outputDir })

      logger.success(`Compiled translations saved to ${outputDir}`)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  } catch (error) {
    logger.error("Error in download command:", error as Error)
    process.exit(1)
  }
}
