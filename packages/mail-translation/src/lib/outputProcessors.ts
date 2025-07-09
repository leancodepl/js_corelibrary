import * as fs from "fs-extra"
import * as path from "path"
import { OutputMode } from "./configLoader"
import { TranslatedMail } from "./mailTranslator"

/**
 * Escapes @media and @import for Razor syntax compatibility
 * @param content - The content to process
 * @returns Content with @media and @import escaped to @@media and @@import
 */
function escapeRazorConflicts(content: string): string {
    // Use negative lookbehind to avoid replacing @media/@import that are already escaped (@@media/@@import)
    return content.replace(/(?<!@)@media/g, "@@media").replace(/(?<!@)@import/g, "@@import")
}

export interface OutputProcessor {
    process(
        translatedMails: { [language: string]: TranslatedMail[] },
        outputPath: string,
        defaultLanguage: string,
    ): Promise<void>
}

/**
 * Razor Output Processor - saves .cshtml files with language-specific naming
 */
export class RazorOutputProcessor implements OutputProcessor {
    async process(
        translatedMails: { [language: string]: TranslatedMail[] },
        outputPath: string,
        defaultLanguage: string,
    ): Promise<void> {
        await fs.ensureDir(outputPath)

        // Group mails by template name
        const mailsByTemplate: { [templateName: string]: { [language: string]: TranslatedMail } } = {}

        for (const [language, mails] of Object.entries(translatedMails)) {
            for (const mail of mails) {
                if (!mailsByTemplate[mail.name]) {
                    mailsByTemplate[mail.name] = {}
                }
                mailsByTemplate[mail.name][language] = mail
            }
        }

        // Save each template
        for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
            // Save default language HTML file without language suffix
            if (languageMails[defaultLanguage]) {
                const defaultPath = path.join(outputPath, `${templateName}.cshtml`)
                const processedHtml = escapeRazorConflicts(languageMails[defaultLanguage].html)
                await fs.writeFile(defaultPath, processedHtml, "utf8")

                // Save default language plaintext file if available
                if (languageMails[defaultLanguage].plaintext) {
                    const defaultPlaintextPath = path.join(outputPath, `${templateName}.txt.cshtml`)
                    const processedPlaintext = escapeRazorConflicts(languageMails[defaultLanguage].plaintext)
                    await fs.writeFile(defaultPlaintextPath, processedPlaintext, "utf8")
                }
            }

            // Save other languages with language suffix
            for (const [language, mail] of Object.entries(languageMails)) {
                if (language !== defaultLanguage) {
                    const languagePath = path.join(outputPath, `${templateName}.${language}.cshtml`)
                    const processedHtml = escapeRazorConflicts(mail.html)
                    await fs.writeFile(languagePath, processedHtml, "utf8")

                    // Save plaintext version if available
                    if (mail.plaintext) {
                        const languagePlaintextPath = path.join(outputPath, `${templateName}.${language}.txt.cshtml`)
                        const processedPlaintext = escapeRazorConflicts(mail.plaintext)
                        await fs.writeFile(languagePlaintextPath, processedPlaintext, "utf8")
                    }
                }
            }
        }
    }
}

/**
 * Kratos Output Processor - saves single .gotmpl file with all languages
 */
export class KratosOutputProcessor implements OutputProcessor {
    async process(
        translatedMails: { [language: string]: TranslatedMail[] },
        outputPath: string,
        defaultLanguage: string,
    ): Promise<void> {
        await fs.ensureDir(outputPath)

        // Group mails by template name
        const mailsByTemplate: { [templateName: string]: { [language: string]: TranslatedMail } } = {}

        for (const [language, mails] of Object.entries(translatedMails)) {
            for (const mail of mails) {
                if (!mailsByTemplate[mail.name]) {
                    mailsByTemplate[mail.name] = {}
                }
                mailsByTemplate[mail.name][language] = mail
            }
        }

        // Generate Kratos template for each mail template
        for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
            // Generate HTML template
            const kratosTemplate = this.generateKratosTemplate(languageMails, defaultLanguage)
            const kratosPath = path.join(outputPath, `${templateName}.gotmpl`)
            await fs.writeFile(kratosPath, kratosTemplate, "utf8")

            // Generate plaintext template if any of the mails have plaintext content
            const hasPlaintext = Object.values(languageMails).some(mail => mail.plaintext)
            if (hasPlaintext) {
                const kratosPlaintextTemplate = this.generateKratosPlaintextTemplate(languageMails, defaultLanguage)
                const kratosPlaintextPath = path.join(outputPath, `${templateName}.plaintext.gotmpl`)
                await fs.writeFile(kratosPlaintextPath, kratosPlaintextTemplate, "utf8")
            }
        }
    }

    private generateKratosTemplate(
        languageMails: { [language: string]: TranslatedMail },
        defaultLanguage: string,
    ): string {
        const languages = Object.keys(languageMails)
        let template = ""

        // Generate template definitions for each language
        for (const language of languages) {
            const mail = languageMails[language]
            template += `{{define "${language}"}}\n`
            template += mail.html
            template += "\n{{end}}\n\n"
        }

        // Generate conditional logic for language selection
        template +=
            '{{- if eq .Identity.traits.lang "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" -}}\n'
        template += '{{ template "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" . }}\n'

        // Add conditions for other non-default languages
        for (const language of languages.filter(lang => lang !== defaultLanguage).slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        // Default fallback
        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"

        return template
    }

    private generateKratosPlaintextTemplate(
        languageMails: { [language: string]: TranslatedMail },
        defaultLanguage: string,
    ): string {
        const languages = Object.keys(languageMails)
        let template = ""

        // Generate template definitions for each language
        for (const language of languages) {
            const mail = languageMails[language]
            template += `{{define "${language}"}}\n`
            // Use plaintext content if available, otherwise skip this language
            if (mail.plaintext) {
                template += mail.plaintext
            }
            template += "\n{{end}}\n\n"
        }

        // Generate conditional logic for language selection
        template +=
            '{{- if eq .Identity.traits.lang "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" -}}\n'
        template += '{{ template "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" . }}\n'

        // Add conditions for other non-default languages
        for (const language of languages.filter(lang => lang !== defaultLanguage).slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        // Default fallback
        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"

        return template
    }
}

/**
 * Factory function to create the appropriate output processor
 */
export function createOutputProcessor(mode: OutputMode): OutputProcessor {
    switch (mode) {
        case "razor":
            return new RazorOutputProcessor()
        case "kratos":
            return new KratosOutputProcessor()
        default:
            throw new Error(`Unsupported output mode: ${mode}`)
    }
}
