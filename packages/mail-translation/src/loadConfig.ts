import { lilconfig } from "lilconfig"
import { MjmlCompileOptions } from "./compileMjml"

export type OutputMode = "kratos" | "razor"

export interface MailTranslationConfig {
    translationsPath?: string
    mailsPath: string
    plaintextMailsPath?: string
    outputPath?: string
    outputMode?: OutputMode
    defaultLanguage?: string
    mjmlOptions?: MjmlCompileOptions
    languages?: string[]
}

export interface CliConfig extends MailTranslationConfig {
    verbose?: boolean
    watch?: boolean
}

const moduleName = "mail-translation"

export async function loadConfig(searchFrom?: string): Promise<CliConfig | null> {
    const explorer = lilconfig(moduleName, {
        searchPlaces: [
            "package.json",
            `.${moduleName}rc`,
            `.${moduleName}rc.json`,
            `.${moduleName}rc.js`,
            `.${moduleName}rc.cjs`,
            `${moduleName}.config.js`,
            `${moduleName}.config.cjs`,
        ],
    })

    try {
        const result = await explorer.search(searchFrom)
        return result ? result.config : null
    } catch (error) {
        throw new Error(`Failed to load configuration: ${error}`)
    }
}

export async function loadConfigFromFile(filepath: string): Promise<CliConfig> {
    const explorer = lilconfig(moduleName)

    try {
        const result = await explorer.load(filepath)
        return result.config
    } catch (error) {
        throw new Error(`Failed to load configuration from ${filepath}: ${error}`)
    }
}

export function validateConfig(config: CliConfig): void {
    if (!config.mailsPath) {
        throw new Error("Configuration must specify mailsPath")
    }

    if (config.outputMode) {
        const validModes: OutputMode[] = ["kratos", "razor"]
        if (!validModes.includes(config.outputMode)) {
            throw new Error(`Invalid outputMode: ${config.outputMode}. Must be one of: ${validModes.join(", ")}`)
        }
    }

    if (config.mjmlOptions?.validationLevel) {
        const validLevels = ["strict", "soft", "skip"]
        if (!validLevels.includes(config.mjmlOptions.validationLevel)) {
            throw new Error(
                `Invalid validationLevel: ${config.mjmlOptions.validationLevel}. Must be one of: ${validLevels.join(", ")}`,
            )
        }
    }
}

export function getDefaultConfig(): CliConfig {
    return {
        translationsPath: "./translations",
        mailsPath: "./mails",
        outputPath: "./output",
        outputMode: "kratos",
        defaultLanguage: "en",
        verbose: false,
        watch: false,
        mjmlOptions: {
            beautify: false,
            minify: false,
            validationLevel: "soft",
            keepComments: false,
        },
    }
}

export function mergeWithDefaults(config: Partial<CliConfig>): CliConfig {
    const defaults = getDefaultConfig()

    const merged = {
        ...defaults,
        ...config,
        mjmlOptions: {
            ...defaults.mjmlOptions,
            ...config.mjmlOptions,
        },
    }

    if (!merged.plaintextMailsPath) {
        merged.plaintextMailsPath = merged.mailsPath
    }

    return merged
}
