import IntlMessageFormat from "intl-messageformat"
import { Translations } from "./loadTranslations"

export function processTranslations(template: string, translations: Translations, locale = "en"): string {
    const simpleTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"]\s*\}\}/g

    const parameterizedTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"],\s*\(([^)]+)\)\s*\}\}/g

    let processedTemplate = template.replace(parameterizedTranslationRegex, (match, key, paramString) => {
        const translationPattern = translations[key]
        if (!translationPattern) {
            return key
        }

        try {
            const params = parseParameters(paramString)

            const formatter = new IntlMessageFormat(translationPattern, locale)
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
        const valueStr = pair.substring(colonIndex + 1).trim()

        let value: string
        if (
            (valueStr.startsWith('"') && valueStr.endsWith('"')) ||
            (valueStr.startsWith("'") && valueStr.endsWith("'"))
        ) {
            value = valueStr.slice(1, -1)
        } else {
            value = valueStr
        }

        params[key] = value
    }

    return params
}
