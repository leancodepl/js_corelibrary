import IntlMessageFormat from "intl-messageformat"
import { OutputMode } from "./loadConfig"
import { Translations } from "./loadTranslations"

export function processTranslations(
    template: string,
    translations: Translations,
    locale = "en",
    outputMode: OutputMode = "kratos",
): string {
    const simpleTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"]\s*\}\}/g

    const parameterizedTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"],\s*\(([^)]+)\)\s*\}\}/g

    let processedTemplate = template.replace(parameterizedTranslationRegex, (match, key, paramString) => {
        const translationPattern = translations[key]
        if (!translationPattern) {
            return key
        }

        try {
            const params = parseParameters(paramString, outputMode)

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

function parseParameters(paramString: string, outputMode: OutputMode): Record<string, any> {
    const params: Record<string, any> = {}

    const paramPairs = paramString.split(",").map(pair => pair.trim())

    for (const pair of paramPairs) {
        const colonIndex = pair.indexOf(":")
        if (colonIndex === -1) continue

        const key = pair.substring(0, colonIndex).trim()
        const valueStr = pair.substring(colonIndex + 1).trim()

        let value: any

        if (
            (valueStr.startsWith('"') && valueStr.endsWith('"')) ||
            (valueStr.startsWith("'") && valueStr.endsWith("'"))
        ) {
            const rawValue = valueStr.slice(1, -1)

            if (outputMode === "razor" && rawValue.startsWith("@")) {
                value = rawValue
            } else if (outputMode === "kratos" && rawValue.includes("{{") && rawValue.includes("}}")) {
                value = rawValue
            } else {
                value = rawValue
            }
        } else if (valueStr === "true") {
            value = true
        } else if (valueStr === "false") {
            value = false
        } else if (!isNaN(Number(valueStr))) {
            value = Number(valueStr)
        } else if (outputMode === "razor" && valueStr.startsWith("@")) {
            value = valueStr
        } else if (outputMode === "kratos" && valueStr.includes("{{") && valueStr.includes("}}")) {
            value = valueStr
        } else {
            value = valueStr
        }

        params[key] = value
    }

    return params
}
