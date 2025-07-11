import { OutputTemplate } from "./generateOutputTemplates"
import { TranslatedMail } from "./processTemplate"

function escapeRazorConflicts(content: string): string {
    return content.replace(/(?<!@)@media/g, "@@media").replace(/(?<!@)@import/g, "@@import")
}

export function generateRazorOutputTemplates(
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
        if (languageMails[defaultLanguage]) {
            const processedHtml = escapeRazorConflicts(languageMails[defaultLanguage].html)
            outputTemplates.push({
                filename: `${templateName}.cshtml`,
                content: processedHtml,
            })

            if (languageMails[defaultLanguage].plaintext) {
                const processedPlaintext = escapeRazorConflicts(languageMails[defaultLanguage].plaintext)
                outputTemplates.push({
                    filename: `${templateName}.txt.cshtml`,
                    content: processedPlaintext,
                })
            }
        }

        for (const [language, mail] of Object.entries(languageMails)) {
            if (language !== defaultLanguage) {
                const processedHtml = escapeRazorConflicts(mail.html)
                outputTemplates.push({
                    filename: `${templateName}.${language}.cshtml`,
                    content: processedHtml,
                })

                if (mail.plaintext) {
                    const processedPlaintext = escapeRazorConflicts(mail.plaintext)
                    outputTemplates.push({
                        filename: `${templateName}.${language}.txt.cshtml`,
                        content: processedPlaintext,
                    })
                }
            }
        }
    }

    return outputTemplates
}
