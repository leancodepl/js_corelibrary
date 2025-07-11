import * as fs from "fs-extra"
import * as path from "path"

export interface Translations {
    [key: string]: string
}

export interface TranslationData {
    [language: string]: Translations
}

/**
 * Loads all translation files from the translations directory
 * @param translationsPath - Path to the translations directory
 * @returns Object containing all translations organized by language
 */
export async function loadTranslations(translationsPath: string): Promise<TranslationData> {
    const translationData: TranslationData = {}

    try {
        // Check if translations directory exists
        const exists = await fs.pathExists(translationsPath)
        if (!exists) {
            console.warn(`Translations directory not found: ${translationsPath}. Continuing without translations.`)
            return translationData
        }

        // Read all files in the translations directory
        const files = await fs.readdir(translationsPath)
        const jsonFiles = files.filter(file => path.extname(file) === ".json")

        if (jsonFiles.length === 0) {
            console.warn(`No translation files found in: ${translationsPath}. Continuing without translations.`)
            return translationData
        }

        // Load each translation file
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

/**
 * Gets translations for a specific language
 * @param translationData - All translation data
 * @param language - Language code (e.g., 'en', 'pl')
 * @param fallbackLanguage - Fallback language if requested language not found
 * @returns Translations for the specified language
 */
export function getTranslationsForLanguage(
    translationData: TranslationData,
    language: string,
    fallbackLanguage = "en",
): Translations {
    return translationData[language] || translationData[fallbackLanguage] || {}
}
