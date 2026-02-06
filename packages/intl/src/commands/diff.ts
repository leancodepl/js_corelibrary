import checkbox from "@inquirer/checkbox"
import confirm from "@inquirer/confirm"
import { z } from "zod/v4"
import { extractMessages } from "../formatjs"
import { logger } from "../logger"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

export const diffCommandOptionsSchema = z.object({
  srcPattern: z.string(),
})

export type DiffCommandOptions = z.infer<typeof diffCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function diff({ srcPattern, translationsServiceClient }: DiffCommandOptions) {
  try {
    logger.info("Analyzing differences between local and remote translations...")

    logger.info("Extracting local messages...")
    const localMessages = extractMessages(srcPattern)
    const localTerms = new Set(Object.keys(localMessages))

    logger.info("Fetching remote terms...")
    const remoteTerms = await translationsServiceClient.downloadTerms()
    const remoteTermSet = new Set(remoteTerms.map(term => term.term))

    const unusedInLocal = [...remoteTermSet].filter(term => !localTerms.has(term))
    const translationsInDefaultLanguage = await translationsServiceClient.getTranslationsInDefaultLanguage(remoteTerms)
    if (unusedInLocal.length > 0) {
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

      await translationsServiceClient.removeTerms(termsToRemoveWithContext)
      logger.success(`\nTerms removed successfully`)
    } else {
      logger.info("\nNo unused terms found in remote")
    }
  } catch (error) {
    logger.error("Error in diff command:", error as Error)
    process.exit(1)
  }
}
