import { OutputTemplate } from "./generateOutputTemplates"
import { TranslatedMail } from "./processTemplate"

/**
 * Escapes @media and @import for Razor syntax compatibility
 * @param content - The content to process
 * @returns Content with @media and @import escaped to @@media and @@import
 */
function escapeRazorConflicts(content: string): string {
    // Use negative lookbehind to avoid replacing @media/@import that are already escaped (@@media/@@import)
    return content.replace(/(?<!@)@media/g, "@@media").replace(/(?<!@)@import/g, "@@import")
}

/**
 * Generate Razor output templates - .cshtml files with language-specific naming
 * @param translatedMails - Object containing translated mails grouped by language
 * @param defaultLanguage - The default language to use
 * @returns Array of output templates with filename and content
 */
export function generateRazorOutputTemplates(
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

    // Generate Razor templates for each mail template
    for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
        // Save default language HTML file without language suffix
        if (languageMails[defaultLanguage]) {
            const processedHtml = escapeRazorConflicts(languageMails[defaultLanguage].html)
            outputTemplates.push({
                filename: `${templateName}.cshtml`,
                content: processedHtml,
            })

            // Save default language plaintext file if available
            if (languageMails[defaultLanguage].plaintext) {
                const processedPlaintext = escapeRazorConflicts(languageMails[defaultLanguage].plaintext)
                outputTemplates.push({
                    filename: `${templateName}.txt.cshtml`,
                    content: processedPlaintext,
                })
            }
        }

        // Save other languages with language suffix
        for (const [language, mail] of Object.entries(languageMails)) {
            if (language !== defaultLanguage) {
                const processedHtml = escapeRazorConflicts(mail.html)
                outputTemplates.push({
                    filename: `${templateName}.${language}.cshtml`,
                    content: processedHtml,
                })

                // Save plaintext version if available
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