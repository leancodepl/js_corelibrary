import checkbox from "@inquirer/checkbox"
import confirm from "@inquirer/confirm"
import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import { extractMessages } from "../formatjs"
import { logger } from "../logger"
import { type GetTranslationsInDefaultLanguageError, stringifyCause } from "../poeditor/POEditorError"

export const diffCommandOptionsSchema = z.object({
  srcPattern: z.string(),
})

export type DiffCommandOptions = z.infer<typeof diffCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function diff({ srcPattern, translationsServiceClient }: DiffCommandOptions) {
  logger.info("Analyzing differences between local and remote translations...")

  logger.info("Extracting local messages...")
  const localMessagesResult = extractMessages(srcPattern)
  if (localMessagesResult.isErr()) {
    logger.error(`Failed to extract messages: ${localMessagesResult.error.message}`)
    process.exit(1)
  }
  const localTerms = new Set(Object.keys(localMessagesResult.value))

  logger.info("Fetching remote terms...")
  const remoteTermsResult = await translationsServiceClient.downloadTerms()
  if (remoteTermsResult.isErr()) {
    logger.error(`Failed to fetch remote terms from POEditor: ${stringifyCause(remoteTermsResult.error.cause)}`)
    process.exit(1)
  }
  const remoteTerms = remoteTermsResult.value
  const remoteTermSet = new Set(remoteTerms.map(term => term.term))

  const unusedInLocal = [...remoteTermSet].filter(term => !localTerms.has(term))

  const defaultLanguageResult = await translationsServiceClient.getTranslationsInDefaultLanguage(remoteTerms)
  if (defaultLanguageResult.isErr()) {
    exitOnDefaultLanguageFailure(defaultLanguageResult.error)
  }
  const translationsInDefaultLanguage = defaultLanguageResult.value

  if (unusedInLocal.length === 0) {
    logger.info("\nNo unused terms found in remote")
    return
  }

  logger.info(`\nTerms in remote but not used locally (${unusedInLocal.length}):`)
  const termsToRemove = await checkbox({
    message: "Select terms to remove",
    choices: unusedInLocal.map(term => {
      const translation = translationsInDefaultLanguage.find(t => t.term === term)?.translation
      return { name: `${term} $`, value: term }
    }),
  })

  if (termsToRemove.length === 0) {
    return
  }

  const confirmation = await confirm({
    message: `Are you sure you want to remove these terms: ${termsToRemove.join(", ")}?`,
  })

  if (!confirmation) {
    return
  }

  const termsToRemoveWithContext = remoteTerms.filter(term => termsToRemove.includes(term.term))
  logger.info(`\nRemoving selected terms from remote...`)

  const removeResult = await translationsServiceClient.removeTerms(termsToRemoveWithContext)
  if (removeResult.isErr()) {
    logger.error(`Failed to remove terms from POEditor: ${stringifyCause(removeResult.error.cause)}`)
    process.exit(1)
  }
  logger.success(`\nTerms removed successfully`)
}

function exitOnDefaultLanguageFailure(error: GetTranslationsInDefaultLanguageError): never {
  switch (error.kind) {
    case "viewProjectFailed":
      logger.error(`Failed to read POEditor project metadata: ${stringifyCause(error.cause)}`)
      break
    case "noReferenceLanguage":
      logger.error("POEditor project has no reference language configured")
      break
    case "downloadTranslationsFailed":
      logger.error(
        `POEditor API call failed while loading reference translations for ${error.language}: ${stringifyCause(error.cause)}`,
      )
      break
    case "noDownloadUrl":
      logger.error(`POEditor returned no download URL for reference language ${error.language}`)
      break
    case "downloadTranslationsContentFailed":
      logger.error(
        `Failed to fetch reference translations for ${error.language} from ${error.url}: ${stringifyCause(error.cause)}`,
      )
      break
  }
  process.exit(1)
}
