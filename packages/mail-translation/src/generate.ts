import { Result, ResultAsync } from "neverthrow"
import type { MailTranslationError } from "./MailTranslationError"
import { MailTranslationConfig } from "./config"
import { loadMjmlTemplates, loadPlaintextTemplates } from "./loadTemplates"
import { loadTranslations } from "./loadTranslations"
import { ProcessedTemplate, processTemplate } from "./processTemplate"

export function generate(
  config: Omit<MailTranslationConfig, "outputPath">,
): ResultAsync<ProcessedTemplate[], MailTranslationError> {
  return ResultAsync.fromSafePromise(loadTranslations(config.translationsPath)).andThen(translationData =>
    ResultAsync.combine([
      loadMjmlTemplates(config.mailsPath),
      loadPlaintextTemplates({
        plaintextMailsPath: config.plaintextMailsPath ?? config.mailsPath,
        outputMode: config.outputMode,
      }),
    ]).andThen(([mjmlTemplates, plaintextTemplates]) =>
      Result.combine(
        [...mjmlTemplates, ...plaintextTemplates].map(template =>
          processTemplate({
            template,
            translationData,
            outputMode: config.outputMode,
            defaultLanguage: config.defaultLanguage,
            kratosLanguageVariable: config.kratosLanguageVariable,
            mailsPath: config.mailsPath,
          }),
        ),
      ),
    ),
  )
}
