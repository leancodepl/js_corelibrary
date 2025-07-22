import IntlMessageFormat from "intl-messageformat"
import { Translations } from "./loadTranslations"

export function processTranslations({
  template,
  translations,
  language,
}: {
  template: string
  translations: Translations
  language?: string
}): string {
  const simpleTranslationRegex = /\{\{t\s+['"]([^'"]+)['"]\s*\}\}/g

  const parameterizedTranslationRegex = /\{\{t\s+['"]([^'"]+)['"],\s*\(([^)]+)\)\s*\}\}/g

  let processedTemplate = template.replace(parameterizedTranslationRegex, (match, key, paramString) => {
    const translationPattern = translations[key]
    if (!translationPattern || !language) {
      return key
    }

    try {
      const params = parseParameters(paramString)

      const formatter = new IntlMessageFormat(translationPattern, language)
      return formatter.format(params)
    } catch (error) {
      console.warn(`Error formatting message for key "${key}":`, error)
      return key
    }
  })

  processedTemplate = processedTemplate.replace(simpleTranslationRegex, (match, key) => {
    return translations[key] || key
  })

  return processedTemplate
}

function parseParameters(paramString: string): Record<string, string> {
  const params: Record<string, string> = {}

  const paramPairs = paramString.split(",").map(pair => pair.trim())

  for (const pair of paramPairs) {
    const colonIndex = pair.indexOf(":")
    if (colonIndex === -1) continue

    const key = pair.substring(0, colonIndex).trim()
    const value = pair.substring(colonIndex + 1).trim()

    params[key] =
      (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value
  }

  return params
}
