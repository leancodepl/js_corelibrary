import { readdir, readFile } from "fs/promises"
import { basename, extname, join } from "path"

export interface Translations {
    [key: string]: string
}

export interface TranslationData {
    [language: string]: Translations
}

export async function loadTranslations(translationsPath?: string) {
    const translationData: TranslationData = {}

    if (!translationsPath) {
        return translationData
    }

    try {
        const files = await readdir(translationsPath)
        const jsonFiles = files.filter(file => extname(file) === ".json")

        if (jsonFiles.length === 0) {
            console.warn(`No translation files found in: ${translationsPath}. Continuing without translations.`)
            return translationData
        }

        for (const file of jsonFiles) {
            const language = basename(file, ".json")
            const filePath = join(translationsPath, file)

            try {
                const content = await readFile(filePath, "utf8")
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
