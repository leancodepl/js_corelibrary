/* eslint-disable no-console */
import { extractMessages } from "../formatjs"
import { mkTranslationsServiceClient } from "../mkTranslationsServiceClient"

export interface UploadCommandOptions {
  srcPattern: string
  poeditorApiToken: string
  poeditorProjectId: number
  defaultLanguage: string
}

export async function upload(options: UploadCommandOptions): Promise<void> {
  try {
    console.log("Extracting messages from source files...")

    const messages = await extractMessages(options.srcPattern)
    const messageCount = Object.keys(messages).length

    console.log(`Found ${messageCount} messages`)

    if (messageCount === 0) {
      console.log("No messages found. Make sure your source files contain formatjs messages.")
      return
    }

    console.log("Uploading terms to POEditor...")

    const client = mkTranslationsServiceClient({
      poeditorApiToken: options.poeditorApiToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    await client.uploadTerms(messages)

    console.log(`Uploading default translations (${options.defaultLanguage}) to POEditor...`)

    await client.uploadTranslations(messages, options.defaultLanguage)

    console.log("Upload completed successfully!")
    console.log("Use 'download' command to fetch translated content.")
  } catch (error) {
    console.error("Error in upload command:", error)
    process.exit(1)
  }
}
