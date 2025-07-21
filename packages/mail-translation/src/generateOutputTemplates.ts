import { OutputMode } from "./config"
import { generateKratosOutputTemplates } from "./generateKratosOutputTemplates"
import { generateRazorOutputTemplates } from "./generateRazorOutputTemplates"
import { TranslatedTemplate } from "./processTemplate"

export interface OutputTemplate {
    filename: string
    content: string
}

export function generateOutputTemplates(
    translatedTemplates: TranslatedTemplate[],
    outputMode: OutputMode,
    defaultLanguage: string,
): OutputTemplate[] {
    switch (outputMode) {
        case "kratos":
            return generateKratosOutputTemplates({ translatedTemplates, defaultLanguage })
        case "razor":
            return generateRazorOutputTemplates({ translatedTemplates, defaultLanguage })
    }
}
