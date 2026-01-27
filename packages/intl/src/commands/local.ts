import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs"
import _ from "lodash"
import { join } from "path"
import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import {
  compileTranslations,
  createTranslationsTempDir,
  extractMessages,
  writeTranslationsToTempDir,
} from "../formatjs"

export const localCommandOptionsSchema = z.object({
  srcPattern: z.string(),
  outputDir: z.string(),
  defaultLanguage: z.string(),
})

export type LocalCommandOptions = z.infer<typeof localCommandOptionsSchema> & {
  translationsServiceClient?: TranslationsServiceClient
}

export async function local({
  defaultLanguage,
  outputDir,
  srcPattern,
  translationsServiceClient,
}: LocalCommandOptions) {
  try {
    const extractedTranslations = extractAndCompile({ srcPattern, defaultLanguage })

    const downloadedTranslations = translationsServiceClient
      ? await downloadAndCompile({ defaultLanguage, client: translationsServiceClient })
      : undefined

    const translations = mergeTranslations({ extractedTranslations, downloadedTranslations })

    save({ translations, outputDir, defaultLanguage })
  } catch (error) {
    console.error("Error in local command:", error)
    process.exit(1)
  }
}

function extractAndCompile({
  srcPattern,
  defaultLanguage,
}: {
  srcPattern: string
  defaultLanguage: string
}): Record<string, string> {
  console.log("Extracting messages from source files...")

  const messages = extractMessages(srcPattern)
  const messageCount = Object.keys(messages).length

  console.log(`Extracted ${messageCount} messages`)

  if (messageCount === 0) {
    console.log("No messages found. Make sure your source files contain formatjs messages.")
    throw new Error("No messages found")
  }

  const tempDir = createTranslationsTempDir("local-")

  try {
    const extractedTranslations: Record<string, string> = {}
    for (const [id, details] of Object.entries(messages)) {
      extractedTranslations[id] = details.defaultMessage
    }

    writeTranslationsToTempDir({ translations: extractedTranslations, language: defaultLanguage, tempDir })

    console.log("Compiling extracted translations...")
    const tempOutputDir = createTranslationsTempDir("compiled-")

    try {
      compileTranslations({ inputDir: tempDir, outputDir: tempOutputDir })

      const compiledFilePath = join(tempOutputDir, `${defaultLanguage}.json`)
      const compiledContent = readFileSync(compiledFilePath, "utf-8")
      return JSON.parse(compiledContent)
    } finally {
      rmSync(tempOutputDir, { recursive: true, force: true })
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

async function downloadAndCompile({
  defaultLanguage,
  client,
}: {
  defaultLanguage: string
  client: TranslationsServiceClient
}): Promise<Record<string, string> | undefined> {
  try {
    console.log(`Downloading ${defaultLanguage} translations...`)

    const downloadedTranslations = await client.downloadTranslations(defaultLanguage)
    const downloadedCount = Object.keys(downloadedTranslations).length
    console.log(`Downloaded ${downloadedCount} translations`)

    if (downloadedCount === 0) {
      return undefined
    }

    const downloadTempDir = createTranslationsTempDir("download-")

    try {
      writeTranslationsToTempDir({
        translations: downloadedTranslations,
        language: defaultLanguage,
        tempDir: downloadTempDir,
      })

      console.log("Compiling downloaded translations...")
      const downloadTempOutputDir = createTranslationsTempDir("download-compiled-")

      try {
        compileTranslations({ inputDir: downloadTempDir, outputDir: downloadTempOutputDir })

        const downloadedCompiledFilePath = join(downloadTempOutputDir, `${defaultLanguage}.json`)
        const downloadedCompiledContent = readFileSync(downloadedCompiledFilePath, "utf-8")
        return JSON.parse(downloadedCompiledContent)
      } finally {
        rmSync(downloadTempOutputDir, { recursive: true, force: true })
      }
    } finally {
      rmSync(downloadTempDir, { recursive: true, force: true })
    }
  } catch (error) {
    console.warn(`Failed to download translations from translation service: ${error}`)
    console.log("Using extracted translations only")
    return undefined
  }
}

function mergeTranslations({
  extractedTranslations,
  downloadedTranslations,
}: {
  extractedTranslations: Record<string, string>
  downloadedTranslations: Record<string, string> | undefined
}): Record<string, string> {
  if (!downloadedTranslations) {
    return extractedTranslations
  }

  const finalTranslations = { ...extractedTranslations, ...downloadedTranslations }

  const newTranslationsCount = Object.keys(extractedTranslations).filter(key => !(key in downloadedTranslations)).length
  const downloadedTranslationsCount = Object.keys(downloadedTranslations).length
  console.log(
    `Merged ${newTranslationsCount} extracted terms with ${downloadedTranslationsCount} downloaded translations`,
  )

  return finalTranslations
}

function save({
  translations,
  outputDir,
  defaultLanguage,
}: {
  translations: Record<string, string>
  outputDir: string
  defaultLanguage: string
}): void {
  mkdirSync(outputDir, { recursive: true })

  const sortedTranslations = _(translations).toPairs().sortBy(0).fromPairs().value()

  const finalFilePath = join(outputDir, `${defaultLanguage}.json`)
  writeFileSync(finalFilePath, JSON.stringify(sortedTranslations, null, 2))

  console.log(`Merged translations saved to ${outputDir}`)
}
