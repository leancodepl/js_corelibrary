/* eslint-disable no-console */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import {
  compileTranslations,
  createTranslationsTempDir,
  extractMessages,
  writeTranslationsToTempDir,
} from "../formatjs"

export interface LocalCommandOptions {
  srcPattern: string
  outputDir: string
  defaultLanguage: string
}

export async function local({ defaultLanguage, outputDir, srcPattern }: LocalCommandOptions): Promise<void> {
  try {
    console.log("Extracting messages from source files...")

    console.log("srcPattern", srcPattern)

    const messages = await extractMessages(srcPattern)
    const messageCount = Object.keys(messages).length

    console.log(`Found ${messageCount} messages`)

    if (messageCount === 0) {
      console.log("No messages found. Make sure your source files contain formatjs messages.")
      return
    }

    const tempDir = createTranslationsTempDir("local-")

    try {
      const extractedTranslations: Record<string, string> = {}
      for (const [id, details] of Object.entries(messages)) {
        extractedTranslations[id] = details.defaultMessage
      }

      writeTranslationsToTempDir(extractedTranslations, defaultLanguage, tempDir)

      console.log("Compiling extracted translations...")
      const tempOutputDir = createTranslationsTempDir("compiled-")

      try {
        await compileTranslations(tempDir, tempOutputDir)

        const compiledFilePath = join(tempOutputDir, `${defaultLanguage}.json`)
        const compiledContent = readFileSync(compiledFilePath, "utf-8")
        const newTranslations = JSON.parse(compiledContent)

        const existingFilePath = join(outputDir, `${defaultLanguage}.json`)
        let finalTranslations = newTranslations

        if (existsSync(existingFilePath)) {
          try {
            console.log(`Found existing ${defaultLanguage}.json file, merging translations...`)
            const existingContent = readFileSync(existingFilePath, "utf-8")
            const existingTranslations = JSON.parse(existingContent)

            finalTranslations = { ...newTranslations, ...existingTranslations }

            const newTermsCount = Object.keys(newTranslations).filter(key => !(key in existingTranslations)).length
            console.log(
              `Added ${newTermsCount} new terms, preserved ${Object.keys(existingTranslations).length} existing translations`,
            )
          } catch (error) {
            console.warn(`Failed to read existing translations file: ${error}`)
            console.log("Using new translations only")
            finalTranslations = newTranslations
          }
        } else {
          console.log("No existing translations found, using all extracted messages")
        }

        mkdirSync(outputDir, { recursive: true })

        const sortedTranslations = Object.keys(finalTranslations)
          .sort()
          .reduce(
            (sorted, key) => {
              sorted[key] = finalTranslations[key]
              return sorted
            },
            {} as Record<string, string>,
          )

        const finalFilePath = join(outputDir, `${defaultLanguage}.json`)
        writeFileSync(finalFilePath, JSON.stringify(sortedTranslations, null, 2))

        console.log(`Merged translations saved to ${outputDir}`)
        console.log(
          "Only default language compiled. Use 'upload' and 'download' commands for full translation workflow.",
        )
      } finally {
        const { rmSync } = await import("fs")
        rmSync(tempOutputDir, { recursive: true, force: true })
      }
    } finally {
      const { rmSync } = await import("fs")
      rmSync(tempDir, { recursive: true, force: true })
    }
  } catch (error) {
    console.error("Error in local command:", error)
    process.exit(1)
  }
}
