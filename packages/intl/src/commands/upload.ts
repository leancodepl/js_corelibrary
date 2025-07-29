/* eslint-disable no-console */
import { extractMessages } from "../formatjs"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export interface UploadCommandOptions {
  srcPattern: string
  translationsServiceClient: TranslationsServiceClient
  defaultLanguage: string
}

export async function upload({ srcPattern, translationsServiceClient, defaultLanguage }: UploadCommandOptions) {
  try {
    console.log("Extracting messages from source files...")

    const messages = await extractMessages(srcPattern)
    const messageCount = Object.keys(messages).length

    console.log(`Extracted ${messageCount} messages`)

    if (messageCount === 0) {
      console.log("No messages found. Make sure your source files contain formatjs messages.")
      return
    }

    console.log("Uploading terms to translation service...")

    await translationsServiceClient.uploadTerms(messages)

    console.log(`Uploading default translations (${defaultLanguage}) to translation service...`)

    await translationsServiceClient.uploadTranslations(messages, defaultLanguage)

    console.log("Upload completed successfully!")
  } catch (error) {
    console.error("Error in upload command:", error)
    process.exit(1)
  }
}
