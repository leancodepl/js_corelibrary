import { z } from "zod/v4"
import { extractMessages } from "../formatjs"
import { logger } from "../logger"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export const uploadCommandOptionsSchema = z.object({
  srcPattern: z.string(),
  defaultLanguage: z.string(),
})

export type UploadCommandOptions = z.infer<typeof uploadCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function upload({ srcPattern, translationsServiceClient, defaultLanguage }: UploadCommandOptions) {
  try {
    logger.info("Extracting messages from source files...")

    const messages = extractMessages(srcPattern)
    const messageCount = Object.keys(messages).length

    logger.info(`Extracted ${messageCount} messages`)

    if (messageCount === 0) {
      logger.warn("No messages found. Make sure your source files contain formatjs messages.")
      return
    }

    logger.info("Uploading terms to translation service...")

    await translationsServiceClient.uploadTerms(messages)

    logger.info(`Uploading default translations (${defaultLanguage}) to translation service...`)

    await translationsServiceClient.uploadTranslations(messages, defaultLanguage)

    logger.success("Upload completed successfully!")
  } catch (error) {
    logger.error("Error in upload command:", error as Error)
    process.exit(1)
  }
}
