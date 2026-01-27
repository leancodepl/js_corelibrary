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
    if (unusedInLocal.length > 0) {
      console.log(`\nTerms in remote but not used locally (${unusedInLocal.length}):`)
      unusedInLocal.forEach(term => {
        console.log(`  - ${term}`)
      })
    } else {
      console.log("\nNo unused terms found in remote")
    }
  } catch (error) {
    console.error("Error in diff command:", error)
    process.exit(1)
  }
}
