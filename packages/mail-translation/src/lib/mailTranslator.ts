import * as fs from "fs-extra"
import * as path from "path"
import { OutputMode } from "./configLoader"
import { compileMjml, MjmlCompileOptions } from "./mjmlCompiler"
import { createOutputProcessor } from "./outputProcessors"
import { processTemplate } from "./templateProcessor"
import { getTranslationsForLanguage, loadTranslations, TranslationData } from "./translationLoader"

export interface MailTranslatorOptions {
    translationsPath: string
    mailsPath: string
    plaintextMailsPath?: string
    outputPath?: string
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

export class MailTranslator {
    private translationData: TranslationData = {}
    private options: MailTranslatorOptions

    constructor(options: MailTranslatorOptions) {
        this.options = {
            outputMode: "kratos",
            defaultLanguage: "en",
            ...options,
        }
    }

    /**
     * Initialize the translator by loading all translations
     */
    async initialize(): Promise<void> {
        this.translationData = await loadTranslations(this.options.translationsPath)
    }

    /**
     * Load all MJML templates from the mails directory
     */
    async loadTemplates(): Promise<{ [name: string]: string }> {
        const templates: { [name: string]: string } = {}

        try {
            const exists = await fs.pathExists(this.options.mailsPath)
            if (!exists) {
                throw new Error(`Mails directory not found: ${this.options.mailsPath}`)
            }

            const files = await fs.readdir(this.options.mailsPath)
            const mjmlFiles = files.filter(file => path.extname(file) === ".mjml")

            for (const file of mjmlFiles) {
                const templateName = path.basename(file, ".mjml")
                const filePath = path.join(this.options.mailsPath, file)
                const content = await fs.readFile(filePath, "utf8")
                templates[templateName] = content
            }

            return templates
        } catch (error) {
            throw new Error(`Failed to load templates: ${error}`)
        }
    }

    /**
     * Load all plaintext templates from the plaintext mails directory
     */
    async loadPlaintextTemplates(): Promise<{ [name: string]: string }> {
        const templates: { [name: string]: string } = {}
        const plaintextPath = this.options.plaintextMailsPath || this.options.mailsPath

        try {
            const exists = await fs.pathExists(plaintextPath)
            if (!exists) {
                // If plaintext directory doesn't exist, return empty templates
                return templates
            }

            const files = await fs.readdir(plaintextPath)
            const outputMode = this.options.outputMode || "kratos"

            // Filter files based on output mode
            let plaintextFiles: string[]
            if (outputMode === "kratos") {
                // Look for .plaintext.gotmpl files
                plaintextFiles = files.filter(file => file.endsWith(".plaintext.gotmpl"))
            } else {
                // Look for .txt.cshtml files
                plaintextFiles = files.filter(file => file.endsWith(".txt.cshtml"))
            }

            for (const file of plaintextFiles) {
                let templateName: string
                if (outputMode === "kratos") {
                    // Remove .plaintext.gotmpl extension
                    templateName = file.replace(/\.plaintext\.gotmpl$/, "")
                } else {
                    // Remove .txt.cshtml extension
                    templateName = file.replace(/\.txt\.cshtml$/, "")
                }

                const filePath = path.join(plaintextPath, file)
                const content = await fs.readFile(filePath, "utf8")
                templates[templateName] = content
            }

            return templates
        } catch (error) {
            throw new Error(`Failed to load plaintext templates: ${error}`)
        }
    }

    /**
     * Translate a single template for a specific language
     * New order: 1) MJML compilation, 2) Translation processing, 3) Output
     */
    translateTemplate(
        templateName: string,
        templateContent: string,
        language: string,
        plaintextContent?: string,
    ): TranslatedMail {
        // Step 1: Compile MJML first (this resolves all mj-include tags)
        const mjmlOptions = {
            ...this.options.mjmlOptions,
            filePath: this.options.mailsPath,
        }

        const compileResult = compileMjml(templateContent, mjmlOptions)

        // Step 2: Process translations on the compiled HTML
        const translations = getTranslationsForLanguage(this.translationData, language)
        const outputMode = this.options.outputMode || "kratos"
        const translatedHtml = processTemplate(compileResult.html, translations, language, outputMode)

        // Step 3: Process plaintext template if provided
        let translatedPlaintext: string | undefined
        if (plaintextContent) {
            translatedPlaintext = processTemplate(plaintextContent, translations, language, outputMode)
        }

        return {
            name: templateName,
            language,
            mjml: templateContent, // Keep original MJML for reference
            html: translatedHtml,
            plaintext: translatedPlaintext,
            errors: compileResult.errors,
        }
    }

    /**
     * Translate all templates for a specific language
     */
    async translateAllTemplates(language: string): Promise<TranslatedMail[]> {
        const templates = await this.loadTemplates()
        const plaintextTemplates = await this.loadPlaintextTemplates()
        const translatedMails: TranslatedMail[] = []

        for (const [templateName, templateContent] of Object.entries(templates)) {
            const plaintextContent = plaintextTemplates[templateName]
            const translatedMail = this.translateTemplate(templateName, templateContent, language, plaintextContent)
            translatedMails.push(translatedMail)
        }

        return translatedMails
    }

    /**
     * Translate all templates for all available languages
     */
    async translateAllTemplatesAllLanguages(): Promise<{ [language: string]: TranslatedMail[] }> {
        const templates = await this.loadTemplates()
        const plaintextTemplates = await this.loadPlaintextTemplates()
        const result: { [language: string]: TranslatedMail[] } = {}

        for (const language of Object.keys(this.translationData)) {
            result[language] = []

            for (const [templateName, templateContent] of Object.entries(templates)) {
                const plaintextContent = plaintextTemplates[templateName]
                const translatedMail = this.translateTemplate(templateName, templateContent, language, plaintextContent)
                result[language].push(translatedMail)
            }
        }

        return result
    }

    /**
     * Save translated mails using the configured output processor
     */
    async saveTranslatedMails(translatedMails: { [language: string]: TranslatedMail[] }): Promise<void> {
        if (!this.options.outputPath) {
            throw new Error("Output path not specified")
        }

        const outputMode = this.options.outputMode || "kratos"
        const defaultLanguage = this.options.defaultLanguage || "en"

        const processor = createOutputProcessor(outputMode)
        await processor.process(translatedMails, this.options.outputPath, defaultLanguage)

        // Log errors if any
        for (const [language, mails] of Object.entries(translatedMails)) {
            for (const mail of mails) {
                if (mail.errors.length > 0) {
                    console.warn(`Errors in ${mail.name} (${language}):`, mail.errors)
                }
            }
        }
    }

    /**
     * Get available languages
     */
    getAvailableLanguages(): string[] {
        return Object.keys(this.translationData)
    }
}
