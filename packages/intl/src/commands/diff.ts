import checkbox from "@inquirer/checkbox"
import confirm from "@inquirer/confirm"
import { z } from "zod/v4"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"
import { extractMessages } from "../formatjs"

export const diffCommandOptionsSchema = z.object({
  srcPattern: z.string(),
})

export type DiffCommandOptions = z.infer<typeof diffCommandOptionsSchema> & {
  translationsServiceClient: TranslationsServiceClient
}

export async function diff({ srcPattern, translationsServiceClient }: DiffCommandOptions) {
  try {
    console.log("Analyzing differences between local and remote translations...")

    console.log("Extracting local messages...")
    const localMessages = extractMessages(srcPattern)
    const localTerms = new Set(Object.keys(localMessages))

    console.log("Fetching remote terms...")
    const remoteTerms = await translationsServiceClient.downloadTerms()
    const remoteTermSet = new Set(remoteTerms.map(term => term.term))

    const unusedInLocal = [...remoteTermSet].filter(term => !localTerms.has(term))
    const translationsInDefaultLanguage = await translationsServiceClient.getTranslationsInDefaultLanguage(remoteTerms)
    if (unusedInLocal.length > 0) {
      console.log(`\nTerms in remote but not used locally (${unusedInLocal.length}):`)
      const termsToRemove = await checkbox({
        message: "Select terms to remove",
        choices: unusedInLocal.map(term => {
          const translation = translationsInDefaultLanguage.find(t => t.term === term)?.translation
          return { name: `${term} ${translation ? `(${translation})` : ""}`, value: term }
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
      console.log(`\nRemoving selected terms from remote...`)

      await translationsServiceClient.removeTerms(termsToRemoveWithContext)
      console.log(`\nTerms removed successfully`)
    } else {
      console.log("\nNo unused terms found in remote")
    }
  } catch (error) {
    console.error("Error in diff command:", error)
    process.exit(1)
  }
}
