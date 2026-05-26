import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import { extractMessages } from "../formatjs"
import { logger } from "../logger"
import { stringifyCause } from "../poeditor/POEditorError"

export const uploadCommandOptionsSchema = z.object({
  srcPattern: z.string(),
  defaultLanguage: z.string(),
})

export type UploadCommandOptions = z.infer<typeof uploadCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function upload({ srcPattern, translationsServiceClient, defaultLanguage }: UploadCommandOptions) {
  logger.info("Extracting messages from source files...")

  const messagesResult = extractMessages(srcPattern)
  if (messagesResult.isErr()) {
    logger.error(`Failed to extract messages: ${messagesResult.error.message}`)
    process.exit(1)
  }
  const messages = messagesResult.value
  const messageCount = Object.keys(messages).length

  logger.info(`Extracted ${messageCount} messages`)

  if (messageCount === 0) {
    logger.warn("No messages found. Make sure your source files contain formatjs messages.")
    return
  }

  logger.info("Uploading terms to translation service...")

  const uploadTermsResult = await translationsServiceClient.uploadTerms(messages)
  if (uploadTermsResult.isErr()) {
    logger.error(`Failed to upload terms to POEditor: ${stringifyCause(uploadTermsResult.error.cause)}`)
    process.exit(1)
  }

  logger.info(`Uploading default translations (${defaultLanguage}) to translation service...`)

  const uploadTranslationsResult = await translationsServiceClient.uploadTranslations(messages, defaultLanguage)
  if (uploadTranslationsResult.isErr()) {
    logger.error(
      `Failed to upload ${defaultLanguage} translations to POEditor: ${stringifyCause(uploadTranslationsResult.error.cause)}`,
    )
    process.exit(1)
  }

  logger.success("Upload completed successfully!")
}
