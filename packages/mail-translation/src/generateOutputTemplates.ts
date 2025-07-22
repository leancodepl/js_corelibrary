import { OutputMode } from "./config"
import { generateKratosOutputTemplates } from "./generateKratosOutputTemplates"
import { generateRazorOutputTemplates } from "./generateRazorOutputTemplates"
import { TranslatedTemplate } from "./processTemplate"

export interface OutputTemplate {
  filename: string
  content: string
}

export function generateOutputTemplates({
  translatedTemplates,
  outputMode,
  defaultLanguage,
  kratosLanguageVariable,
}: {
  translatedTemplates: TranslatedTemplate[]
  outputMode: OutputMode
  defaultLanguage?: string
  kratosLanguageVariable?: string
}): OutputTemplate[] {
  switch (outputMode) {
    case "kratos":
      return generateKratosOutputTemplates({
        translatedTemplates,
        defaultLanguage,
        kratosLanguageVariable,
      })
    case "razor":
      return generateRazorOutputTemplates({ translatedTemplates, defaultLanguage })
  }
}
