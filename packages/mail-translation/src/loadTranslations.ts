import * as fs from "fs-extra"
import * as path from "path"

export interface Translations {
    [key: string]: string
}

export interface TranslationData {
    [language: string]: Translations
}

export async function loadTranslations(translationsPath: string): Promise<TranslationData> {
    const translationData: TranslationData = {}

    try {
        const exists = await fs.pathExists(translationsPath)
        if (!exists) {
            console.warn(`Translations directory not found: ${translationsPath}. Continuing without translations.`)
            return translationData
        }

        const files = await fs.readdir(translationsPath)
        const jsonFiles = files.filter(file => path.extname(file) === ".json")

        if (jsonFiles.length === 0) {
            console.warn(`No translation files found in: ${translationsPath}. Continuing without translations.`)
            return translationData
        }

        for (const file of jsonFiles) {
            const language = path.basename(file, ".json")
            const filePath = path.join(translationsPath, file)

            try {
                const content = await fs.readFile(filePath, "utf8")
                const translations = JSON.parse(content)
                translationData[language] = translations
            } catch (error) {
                console.warn(`Failed to load translation file ${file}:`, error)
            }
        }

        return translationData
    } catch (error) {
        console.warn(`Failed to load translations: ${error}. Continuing without translations.`)
        return translationData
    }
}

export function getTranslationsForLanguage(
    translationData: TranslationData,
    language: string,
    fallbackLanguage = "en",
): Translations {
    return translationData[language] || translationData[fallbackLanguage] || {}
}
