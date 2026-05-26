import { OptionsSync as LilconfigOptionsSync, lilconfigSync } from "lilconfig"
import { err, ok, Result } from "neverthrow"
import * as yaml from "yaml"
import type { LoadConfigError } from "./MailTranslationError"
import { MailTranslationConfig, mailTranslationConfigSchema } from "./config"

function loadYaml(filepath: string, content: string) {
  return yaml.parse(content)
}

const packageName = "mail-translation"

const options: LilconfigOptionsSync = {
  searchPlaces: [
    `.${packageName}rc`,
    `.${packageName}rc.json`,
    `.${packageName}rc.yaml`,
    `.${packageName}rc.yml`,
    `.${packageName}rc.js`,
    `.${packageName}rc.cjs`,
    `${packageName}.config.js`,
    `${packageName}.config.cjs`,
  ],
  loaders: {
    ".yaml": loadYaml,
    ".yml": loadYaml,
  },
}

export function loadConfig(configPath?: string): Result<MailTranslationConfig, LoadConfigError> {
  const searcher = lilconfigSync("mail-translation", options)

  const result = configPath ? searcher.load(configPath) : searcher.search()
  if (!result) {
    return err({ kind: "configFileNotFound" })
  }

  const parsed = mailTranslationConfigSchema.safeParse(result.config)
  if (!parsed.success) {
    return err({ kind: "configValidationFailed", cause: parsed.error })
  }
  return ok(parsed.data)
}
