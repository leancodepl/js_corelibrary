import { MailTranslationConfig } from "./config"
import { loadMjmlTemplates, loadPlaintextTemplates } from "./loadTemplates"
import { loadTranslations } from "./loadTranslations"
import { processTemplate } from "./processTemplate"

export async function generate(config: Omit<MailTranslationConfig, "outputPath">) {
  const translationData = await loadTranslations(config.translationsPath)

  const mjmlTemplates = await loadMjmlTemplates(config.mailsPath)
  const plaintextTemplates = await loadPlaintextTemplates({
    plaintextMailsPath: config.plaintextMailsPath ?? config.mailsPath,
    outputMode: config.outputMode,
  })

  return [...mjmlTemplates, ...plaintextTemplates].map(template =>
    processTemplate({
      template,
      translationData,
      outputMode: config.outputMode,
      defaultLanguage: config.defaultLanguage,
      kratosLanguageVariable: config.kratosLanguageVariable,
      mailsPath: config.mailsPath,
    }),
  )
}
