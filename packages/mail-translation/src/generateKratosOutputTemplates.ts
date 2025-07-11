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
        const kratosTemplate = generateKratosTemplate(languageMails, defaultLanguage)
        outputTemplates.push({
            filename: `${templateName}.gotmpl`,
            content: kratosTemplate,
        })

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

function generateKratosTemplate(
    languageMails: { [language: string]: TranslatedMail },
    defaultLanguage: string,
): string {
    const languages = Object.keys(languageMails)

    if (languages.length === 1) {
        const mail = languageMails[languages[0]]
        return mail.html
    }

    let template = ""

    for (const language of languages) {
        const mail = languageMails[language]
        template += `{{define "${language}"}}\n`
        template += mail.html
        template += "\n{{end}}\n\n"
    }

    const nonDefaultLanguages = languages.filter(lang => lang !== defaultLanguage)

    if (nonDefaultLanguages.length > 0) {
        template += '{{- if eq .Identity.traits.lang "' + nonDefaultLanguages[0] + '" -}}\n'
        template += '{{ template "' + nonDefaultLanguages[0] + '" . }}\n'

        for (const language of nonDefaultLanguages.slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"
    } else {
        template += '{{ template "' + defaultLanguage + '" . }}\n'
    }

    return template
}

function generateKratosPlaintextTemplate(
    languageMails: { [language: string]: TranslatedMail },
    defaultLanguage: string,
): string {
    const languages = Object.keys(languageMails)

    if (languages.length === 1) {
        const mail = languageMails[languages[0]]
        return mail.plaintext || ""
    }

    let template = ""

    for (const language of languages) {
        const mail = languageMails[language]
        template += `{{define "${language}"}}\n`
        if (mail.plaintext) {
            template += mail.plaintext
        }
        template += "\n{{end}}\n\n"
    }

    const nonDefaultLanguages = languages.filter(lang => lang !== defaultLanguage)

    if (nonDefaultLanguages.length > 0) {
        template += '{{- if eq .Identity.traits.lang "' + nonDefaultLanguages[0] + '" -}}\n'
        template += '{{ template "' + nonDefaultLanguages[0] + '" . }}\n'

        for (const language of nonDefaultLanguages.slice(1)) {
            template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n'
            template += '{{ template "' + language + '" . }}\n'
        }

        template += "{{- else -}}\n"
        template += '{{ template "' + defaultLanguage + '" . }}\n'
        template += "{{- end -}}\n"
    } else {
        template += '{{ template "' + defaultLanguage + '" . }}\n'
    }

    return template
}
