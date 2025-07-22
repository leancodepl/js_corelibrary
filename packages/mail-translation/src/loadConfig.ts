import { OptionsSync as LilconfigOptionsSync, lilconfigSync } from "lilconfig"
import * as yaml from "yaml"
import { MailTranslationConfig, mailTranslationConfigSchema } from "./config"

function loadYaml(filepath: string, content: string) {
    return yaml.parse(content)
}

const options: LilconfigOptionsSync = {
    loaders: {
        ".yaml": loadYaml,
        ".yml": loadYaml,
    },
}

export function loadConfig(configPath?: string): MailTranslationConfig {
    const searcher = lilconfigSync("mail-translation", options)

    const result = configPath ? searcher.load(configPath) : searcher.search()
    if (!result) {
        throw new Error("No configuration file found")
    }

    try {
        return mailTranslationConfigSchema.parse(result.config)
    } catch (error) {
        throw new Error(`Failed to load configuration: ${error}`)
    }
}
