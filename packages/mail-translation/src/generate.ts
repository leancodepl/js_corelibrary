import { CliConfig } from "./loadConfig"
import { loadTranslations, TranslationData } from "./loadTranslations"
import { ProcessedTemplate, processTemplate, Template } from "./processTemplate"
import { loadPlaintextTemplates, loadTemplates } from "./templateLoader"

export interface GenerateOptions {
    config: CliConfig
    languagesToProcess?: string[]
    verbose?: boolean
}

export interface GenerateResult {
    processedTemplates: ProcessedTemplate[]
    languagesToProcess: string[]
    config: CliConfig
}

export async function generate(options: GenerateOptions): Promise<GenerateResult> {
    const { config, verbose = false } = options

    if (verbose) {
        console.log("Configuration:", JSON.stringify(config, null, 2))
    }

    let translationData: TranslationData = {}
    if (config.translationsPath) {
        translationData = await loadTranslations(config.translationsPath)
    } else {
        console.warn("No translations path provided. Continuing without translations.")
    }

    const mjmlTemplates = await loadTemplates(config.mailsPath)
    const plaintextTemplates = await loadPlaintextTemplates(
        config.plaintextMailsPath || config.mailsPath,
        config.outputMode,
    )

    const availableLanguages = Object.keys(translationData)
    const hasTranslations = availableLanguages.length > 0

    if (verbose) {
        console.log("Available languages:", hasTranslations ? availableLanguages : [config.defaultLanguage])
    }

    if (!hasTranslations) {
        console.log("No translations found. Processing templates without translations.")
    }

    let languagesToProcess: string[]
    if (options.languagesToProcess) {
        languagesToProcess = options.languagesToProcess
    } else if (config.languages) {
        languagesToProcess = config.languages
    } else {
        languagesToProcess = hasTranslations ? availableLanguages : [config.defaultLanguage]
    }

    const allAvailableLanguages = hasTranslations ? availableLanguages : [config.defaultLanguage]
    for (const lang of languagesToProcess) {
        if (!allAvailableLanguages.includes(lang)) {
            throw new Error(`Language '${lang}' not found. Available languages: ${allAvailableLanguages.join(", ")}`)
        }
    }

    console.log(`Processing languages: ${languagesToProcess.join(", ")}`)
    console.log(`Output mode: ${config.outputMode}`)
    console.log(`Default language: ${config.defaultLanguage}`)

    const processedTemplates: ProcessedTemplate[] = []

    for (const [templateName, mjmlContent] of Object.entries(mjmlTemplates)) {
        if (verbose) {
            console.log(`Processing template: ${templateName}`)
        }

        const template: Template = {
            name: templateName,
            mjml: mjmlContent,
            plaintext: plaintextTemplates[templateName],
        }

        const processedTemplate = processTemplate(template, translationData, {
            outputMode: config.outputMode,
            defaultLanguage: config.defaultLanguage,
            mjmlOptions: {
                ...config.mjmlOptions,
                filePath: config.mailsPath,
            },
        })

        processedTemplates.push(processedTemplate)
    }

    for (const language of languagesToProcess) {
        const templatesForLanguage = processedTemplates.filter(pt => pt.translatedMails[language])
        console.log(`✓ ${language}: ${templatesForLanguage.length} templates processed`)

        for (const processedTemplate of templatesForLanguage) {
            const translatedMail = processedTemplate.translatedMails[language]
            if (translatedMail && translatedMail.errors.length > 0) {
                console.warn(`  ⚠ ${translatedMail.name}: ${translatedMail.errors.length} errors`)
                if (verbose) {
                    translatedMail.errors.forEach((error: any) => {
                        console.warn(`    - Line ${error.line}: ${error.message}`)
                    })
                }
            }
        }
    }

    return {
        processedTemplates,
        languagesToProcess,
        config,
    }
}
