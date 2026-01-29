import { lilconfigSync } from "lilconfig"
import { z } from "zod/v4"

const packageName = "intl"

export const intlConfigSchema = z.object({
  srcPattern: z.string().optional(),
  outputDir: z.string().optional(),
  defaultLanguage: z.string().optional(),
  languages: z.array(z.string()).optional(),
  poeditorApiToken: z.string().optional(),
  poeditorProjectId: z.number().optional(),
})

export type IntlConfig = z.infer<typeof intlConfigSchema>

const searchOptions = {
  searchPlaces: [`${packageName}.config.js`, `${packageName}.config.cjs`],
}

export function loadConfig(configPath?: string): IntlConfig | undefined {
  const searcher = lilconfigSync(packageName, searchOptions)

  const result = configPath ? searcher.load(configPath) : searcher.search()

  if (!result) {
    return undefined
  }

  return intlConfigSchema.parse(result.config)
}
