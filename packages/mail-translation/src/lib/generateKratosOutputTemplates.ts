import { OutputTemplate } from "./generateOutputTemplates"
import { TranslatedMail } from "./processTemplate"

/**
 * Generate Kratos output templates - single .gotmpl file with all languages
 * @param translatedMails - Object containing translated mails grouped by language
 * @param defaultLanguage - The default language to use
 * @returns Array of output templates with filename and content
 */
export function generateKratosOutputTemplates(
    translatedMails: { [language: string]: TranslatedMail[] },
    defaultLanguage: string,
): OutputTemplate[] {
    const outputTemplates: OutputTemplate[] = []

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
        const kratosTemplate = generateKratosTemplate(languageMails, defaultLanguage)
        outputTemplates.push({
            filename: `${templateName}.gotmpl`,
            content: kratosTemplate,
        })

        // Generate plaintext template if any of the mails have plaintext content
        const hasPlaintext = Object.values(languageMails).some(mail => mail.plaintext)
        if (hasPlaintext) {
            const kratosPlaintextTemplate = generateKratosPlaintextTemplate(languageMails, defaultLanguage)
            outputTemplates.push({
                filename: `${templateName}.plaintext.gotmpl`,
                content: kratosPlaintextTemplate,
            })
        }
    }

    return outputTemplates
}

/**
 * Generate Kratos HTML template with language definitions and conditional logic
 */
function generateKratosTemplate(
    languageMails: { [language: string]: TranslatedMail },
    defaultLanguage: string,
): string {
    const languages = Object.keys(languageMails)

    // If there's only one language, output the template content directly without {{define}} sections
    if (languages.length === 1) {
        const mail = languageMails[languages[0]]
        return mail.html
    }

    let template = ""

    // Generate template definitions for each language
    for (const language of languages) {
        const mail = languageMails[language]
        template += `{{define "${language}"}}\n`
        template += mail.html
        template += "\n{{end}}\n\n"
    }

    // Generate conditional logic for language selection
    const nonDefaultLanguages = languages.filter(lang => lang !== defaultLanguage)

    if (nonDefaultLanguages.length > 0) {
        template += '{{- if eq .Identity.traits.lang "' + nonDefaultLanguages[0] + '" -}}\n'
        template += '{{ template "' + nonDefaultLanguages[0] + '" . }}\n'

        // Add conditions for other non-default languages
        for (const language of nonDefaultLanguages.slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        // Default fallback
        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"
    } else {
        // Only default language available
        template += '{{ template "' + defaultLanguage + '" . }}\n'
    }

    return template
}

/**
 * Generate Kratos plaintext template with language definitions and conditional logic
 */
function generateKratosPlaintextTemplate(
    languageMails: { [language: string]: TranslatedMail },
    defaultLanguage: string,
): string {
    const languages = Object.keys(languageMails)

    // If there's only one language, output the template content directly without {{define}} sections
    if (languages.length === 1) {
        const mail = languageMails[languages[0]]
        return mail.plaintext || ""
    }

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
    const nonDefaultLanguages = languages.filter(lang => lang !== defaultLanguage)

    if (nonDefaultLanguages.length > 0) {
        template += '{{- if eq .Identity.traits.lang "' + nonDefaultLanguages[0] + '" -}}\n'
        template += '{{ template "' + nonDefaultLanguages[0] + '" . }}\n'

        // Add conditions for other non-default languages
        for (const language of nonDefaultLanguages.slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        // Default fallback
        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"
    } else {
        // Only default language available
        template += '{{ template "' + defaultLanguage + '" . }}\n'
    }

    return template
} 