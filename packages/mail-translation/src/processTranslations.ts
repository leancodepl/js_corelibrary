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
  const translationRegex = /\(\(t\s+['"]([^'"]+)['"]\s*(?:,\s*(\{.*?\}))?\s*\)\)/g

  const processedTemplate = template.replace(translationRegex, (match, key, jsonParams) => {
    const translation = translations[key]

    if (!translation || !language) {
      console.warn(`Translation is missing for key "${key}"` + (language ? ` for "${language}" language` : ""))
      return key
    }

    if (jsonParams && language) {
      try {
        const params = JSON.parse(jsonParams)
        const formatter = new IntlMessageFormat(translation, language)
        return formatter.format(params)
      } catch (error) {
        console.warn(`Error parsing JSON parameters or formatting message for key "${key}":`, error)
        return key
      }
    } else {
      return translation
    }
  })

  return processedTemplate
}
