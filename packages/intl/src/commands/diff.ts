import { z } from "zod/v4"
import { extractMessages } from "../formatjs"
import type { TranslationsServiceClient } from "../TranslationsServiceClient"

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

    console.log("\nComparison Results:")
    console.log(`Local terms: ${localTerms.size}`)
    console.log(`Remote terms: ${remoteTermSet.size}`)

    const unusedInLocal = [...remoteTermSet].filter(term => !localTerms.has(term))
    if (unusedInLocal.length > 0) {
      console.log(`\nTerms in remote but not used locally (${unusedInLocal.length}):`)
      unusedInLocal.forEach(term => {
        console.log(`  - ${term}`)
      })
    } else {
      console.log("\nNo unused terms found in remote")
    }

    const missingInRemote = [...localTerms].filter(term => !remoteTermSet.has(term))
    if (missingInRemote.length > 0) {
      console.log(`\nTerms used locally but missing in remote (${missingInRemote.length}):`)
      missingInRemote.forEach(term => {
        console.log(`  - ${term}`)
      })
      console.log("Run 'upload' command to add these terms to remote")
    } else {
      console.log("\nAll local terms are present in remote")
    }
  } catch (error) {
    console.error("Error in diff command:", error)
    process.exit(1)
  }
}
