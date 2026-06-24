import { ok, Result } from "neverthrow"
import type { CompileMjmlError } from "./MailTranslationError"
import { compileMjml, MjmlParseError } from "./compileMjml"
import { OutputMode } from "./config"
import { generateOutputTemplates, OutputTemplate } from "./generateOutputTemplates"
import { TranslationData } from "./loadTranslations"
import { processTranslations } from "./processTranslations"

export interface Template {
  name: string
  content: string
  isPlaintext: boolean
}

export interface TranslatedTemplate {
  name: string
  content: string
  isPlaintext: boolean
  language?: string
}

export interface ProcessedTemplate {
  name: string
  mjmlParseErrors: MjmlParseError[]
  outputTemplates: OutputTemplate[]
}

export function processTemplate({
  template,
  translationData,
  outputMode,
  defaultLanguage,
  kratosLanguageVariable,
  mailsPath,
}: {
  template: Template
  translationData: TranslationData
  outputMode: OutputMode
  defaultLanguage?: string
  kratosLanguageVariable?: string
  mailsPath: string
}): Result<ProcessedTemplate, CompileMjmlError> {
  const availableLanguages = Object.keys(translationData)
  const languagesToProcess = availableLanguages.length > 0 ? availableLanguages : [defaultLanguage]

  const mjmlCompileResult = template.isPlaintext
    ? ok(undefined)
    : compileMjml({ mjmlContent: template.content, filePath: mailsPath })

  return mjmlCompileResult.map(compiled => {
    const content = template.isPlaintext ? template.content : (compiled?.html ?? "")

    const translatedTemplates = languagesToProcess.map(language => {
      const translations = language ? (translationData[language] ?? {}) : {}

      const translatedContent = processTranslations({ template: content, translations, language })

      return {
        name: template.name,
        content: translatedContent,
        isPlaintext: template.isPlaintext,
        language,
      }
    })

    const outputTemplates = generateOutputTemplates({
      translatedTemplates,
      outputMode,
      defaultLanguage,
      kratosLanguageVariable,
    })

    return {
      name: template.name,
      mjmlParseErrors: compiled?.mjmlParseErrors ?? [],
      outputTemplates,
    }
  })
}
