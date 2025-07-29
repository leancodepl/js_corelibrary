/* eslint-disable no-console */
import { extractMessages } from "../formatjs"
import { mkTranslationsServiceClient } from "../mkTranslationsServiceClient"

export interface DiffCommandOptions {
  srcPattern: string
  poeditorApiToken: string
  poeditorProjectId: number
}

export async function diff(options: DiffCommandOptions): Promise<void> {
  try {
    console.log("Analyzing differences between local and POEditor...")

    console.log("Extracting local messages...")
    const localMessages = await extractMessages(options.srcPattern)
    const localTerms = new Set(Object.keys(localMessages))

    console.log("Fetching POEditor terms...")
    const client = mkTranslationsServiceClient({
      poeditorApiToken: options.poeditorApiToken,
      poeditorProjectId: options.poeditorProjectId,
    })
    const poeditorTerms = await client.downloadTerms()
    const poeditorTermSet = new Set(poeditorTerms.map(term => term.term))

    console.log("\nComparison Results:")
    console.log(`Local terms: ${localTerms.size}`)
    console.log(`POEditor terms: ${poeditorTermSet.size}`)

    const unusedInLocal = [...poeditorTermSet].filter(term => !localTerms.has(term))
    if (unusedInLocal.length > 0) {
      console.log(`\nTerms in POEditor but not used locally (${unusedInLocal.length}):`)
      unusedInLocal.forEach(term => {
        console.log(`  - ${term}`)
      })
    } else {
      console.log("\nNo unused terms found in POEditor")
    }

    const missingInPoEditor = [...localTerms].filter(term => !poeditorTermSet.has(term))
    if (missingInPoEditor.length > 0) {
      console.log(`\nTerms used locally but missing in POEditor (${missingInPoEditor.length}):`)
      missingInPoEditor.forEach(term => {
        console.log(`  - ${term}`)
      })
      console.log("Run 'upload' command to add these terms to POEditor")
    } else {
      console.log("\nAll local terms are present in POEditor")
    }

    console.log(`\nChecking default language translation differences...`)

    if (localTerms.size === poeditorTermSet.size) {
      console.log("✅ Term counts match perfectly")
    } else {
      const difference = Math.abs(localTerms.size - poeditorTermSet.size)
      console.log(`⚠️  Term count difference: ${difference}`)
    }

    const matchingTerms = [...localTerms].filter(term => poeditorTermSet.has(term))
    console.log(`📊 Matching terms: ${matchingTerms.length}`)
    console.log(`📊 Total unique terms: ${new Set([...localTerms, ...poeditorTermSet]).size}`)
  } catch (error) {
    console.error("Error in diff command:", error)
    process.exit(1)
  }
}
