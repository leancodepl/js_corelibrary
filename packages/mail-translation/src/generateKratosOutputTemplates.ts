import { OutputTemplate } from "./generateOutputTemplates"
import { TranslatedMail } from "./processTemplate"

export function generateKratosOutputTemplates(
    translatedMails: { [language: string]: TranslatedMail[] },
    defaultLanguage: string,
): OutputTemplate[] {
    const outputTemplates: OutputTemplate[] = []

    const mailsByTemplate: { [templateName: string]: { [language: string]: TranslatedMail } } = {}

    for (const [language, mails] of Object.entries(translatedMails)) {
        for (const mail of mails) {
            if (!mailsByTemplate[mail.name]) {
                mailsByTemplate[mail.name] = {}
            }
            mailsByTemplate[mail.name][language] = mail
        }
    }

    for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
        const htmlContent = Object.fromEntries(
            Object.entries(languageMails).map(([lang, mail]) => [lang, mail.html])
        )
        const kratosTemplate = generateKratosTemplate(htmlContent, defaultLanguage)
        outputTemplates.push({
            filename: `${templateName}.gotmpl`,
            content: kratosTemplate,
        })

        const hasPlaintext = Object.values(languageMails).some(mail => mail.plaintext)
        if (hasPlaintext) {
            const plaintextContent = Object.fromEntries(
                Object.entries(languageMails).map(([lang, mail]) => [lang, mail.plaintext || ""])
            )
            const kratosPlaintextTemplate = generateKratosTemplate(plaintextContent, defaultLanguage)
            outputTemplates.push({
                filename: `${templateName}.plaintext.gotmpl`,
                content: kratosPlaintextTemplate,
            })
        }
    }

    return outputTemplates
}

function generateKratosTemplate(
    content: { [language: string]: string },
    defaultLanguage: string,
): string {
    const languages = Object.keys(content)

    if (languages.length === 1) {
        return content[languages[0]]
    }

    let template = ""

    template += generateTranslationsSection(content)
    template += generateConditionalRenderingSection(languages, defaultLanguage)

    return template
}

function generateTranslationsSection(
    content: { [language: string]: string },
): string {
    let template = ""
    
    for (const [language, languageContent] of Object.entries(content)) {
        template += `{{define "${language}"}}\n`
        template += languageContent
        template += "\n{{end}}\n\n"
    }
    
    return template
}

function generateConditionalRenderingSection(languages: string[], defaultLanguage: string): string {
    const nonDefaultLanguages = languages.filter(lang => lang !== defaultLanguage)

    if (nonDefaultLanguages.length === 0) {
        return `{{ template "${defaultLanguage}" . }}\n`
    }

    let template = ""
    
    template += `{{- if eq .Identity.traits.lang "${nonDefaultLanguages[0]}" -}}\n`
    template += `{{ template "${nonDefaultLanguages[0]}" . }}\n`

    for (const language of nonDefaultLanguages.slice(1)) {
        template += `{{- else if eq .Identity.traits.lang "${language}" -}}\n`
        template += `{{ template "${language}" . }}\n`
    }
    
    template += "{{- else -}}\n"
    template += `{{ template "${defaultLanguage}" . }}\n`
    template += "{{- end -}}\n"

    return template
}
