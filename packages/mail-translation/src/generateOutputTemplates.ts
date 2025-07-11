import { generateKratosOutputTemplates } from "./generateKratosOutputTemplates"
import { generateRazorOutputTemplates } from "./generateRazorOutputTemplates"
import { OutputMode } from "./loadConfig"
import { TranslatedMail } from "./processTemplate"

export interface OutputTemplate {
    filename: string
    content: string
}

export function generateOutputTemplates(
    translatedMails: { [language: string]: TranslatedMail[] },
    outputMode: OutputMode,
    defaultLanguage: string,
): OutputTemplate[] {
    switch (outputMode) {
        case "kratos":
            return generateKratosOutputTemplates(translatedMails, defaultLanguage)
        case "razor":
            return generateRazorOutputTemplates(translatedMails, defaultLanguage)
        default:
            throw new Error(`Unsupported output mode: ${outputMode}`)
    }
}
