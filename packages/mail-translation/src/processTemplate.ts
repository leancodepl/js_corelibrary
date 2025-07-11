import { compileMjml, MjmlCompileOptions } from "./compileMjml"
import { generateOutputTemplates, OutputTemplate } from "./generateOutputTemplates"
import { OutputMode } from "./loadConfig"
import { getTranslationsForLanguage, TranslationData } from "./loadTranslations"
import { processTranslations } from "./processTranslations"

export interface ProcessTemplateOptions {
    outputMode?: OutputMode
    defaultLanguage?: string
    mjmlOptions?: MjmlCompileOptions
}

export interface TranslatedMail {
    name: string
    language: string
    mjml: string
    html: string
    plaintext?: string
    errors: Array<{
        line: number
        message: string
        tagName: string
    }>
}

export interface Template {
    name: string
    mjml: string
    plaintext?: string
}

export interface ProcessedTemplate {
    name: string
    errors: Array<{
        line: number
        message: string
        tagName: string
    }>
    translatedMails: { [language: string]: TranslatedMail }
    outputTemplates: OutputTemplate[]
}

export function processTemplate(
    template: Template,
    translationData: TranslationData,
    options: ProcessTemplateOptions = {},
): ProcessedTemplate {
    const { outputMode = "kratos", defaultLanguage = "en", mjmlOptions = {} } = options

    const availableLanguages = Object.keys(translationData)
    const languagesToProcess = availableLanguages.length > 0 ? availableLanguages : [defaultLanguage]

    const compileResult = compileMjml(template.mjml, mjmlOptions)

    const translatedMails: { [language: string]: TranslatedMail } = {}

    for (const language of languagesToProcess) {
        const translations = getTranslationsForLanguage(translationData, language, defaultLanguage)
        const translatedHtml = processTranslations(compileResult.html, translations, language, outputMode)

        let translatedPlaintext: string | undefined
        if (template.plaintext) {
            translatedPlaintext = processTranslations(template.plaintext, translations, language, outputMode)
        }

        translatedMails[language] = {
            name: template.name,
            language,
            mjml: template.mjml,
            html: translatedHtml,
            plaintext: translatedPlaintext,
            errors: compileResult.errors,
        }
    }

    const singleTemplateTranslatedMails: { [language: string]: TranslatedMail[] } = {}
    for (const [language, translatedMail] of Object.entries(translatedMails)) {
        singleTemplateTranslatedMails[language] = [translatedMail]
    }
    const outputTemplates = generateOutputTemplates(singleTemplateTranslatedMails, outputMode, defaultLanguage)

    return {
        name: template.name,
        errors: compileResult.errors,
        translatedMails,
        outputTemplates,
    }
}
