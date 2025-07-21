import { compileMjml } from "./compileMjml"
import { OutputMode } from "./config"
import { generateOutputTemplates, OutputTemplate } from "./generateOutputTemplates"
import { TranslationData } from "./loadTranslations"
import { processTranslations } from "./processTranslations"

export interface ProcessTemplateOptions {
    outputMode: OutputMode
    defaultLanguage?: string
    mailsPath?: string
}

export interface Template {
    name: string
    content: string
    isPlaintext: boolean
}

export interface TranslatedTemplate {
    name: string
    content: string
    isPlaintext: boolean
    language: string
}

export interface ProcessedTemplate {
    name: string
    errors: Array<{
        line: number
        message: string
        tagName: string
    }>
    outputTemplates: OutputTemplate[]
}

export function processTemplate(
    template: Template,
    translationData: TranslationData,
    options: ProcessTemplateOptions,
): ProcessedTemplate {
    const { outputMode, defaultLanguage, mailsPath } = options

    const availableLanguages = Object.keys(translationData)
    const languagesToProcess = availableLanguages.length > 0 ? availableLanguages : [defaultLanguage]

    const mjmlCompileResult = template.isPlaintext
        ? undefined
        : compileMjml({ mjmlContent: template.content, filePath: mailsPath })

    const content = template.isPlaintext ? template.content : mjmlCompileResult.html

    const translatedTemplates = languagesToProcess.map(language => {
        const translations = translationData[language] ?? {}

        const translatedContent = processTranslations(content, translations, language)

        return {
            name: template.name,
            content: translatedContent,
            isPlaintext: template.isPlaintext,
            language,
        }
    })

    const outputTemplates = generateOutputTemplates(translatedTemplates, outputMode, defaultLanguage)

    return {
        name: template.name,
        errors: mjmlCompileResult?.mjmlParseErrors ?? [],
        outputTemplates,
    }
}
