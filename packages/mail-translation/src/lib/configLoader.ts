import { lilconfig } from "lilconfig"
import { MjmlCompileOptions } from "./mjmlCompiler"

export type OutputMode = "kratos" | "razor"

export interface MailTranslationConfig {
    translationsPath: string
    mailsPath: string
    plaintextMailsPath?: string
    outputPath?: string
    outputMode?: OutputMode
    defaultLanguage?: string
    mjmlOptions?: MjmlCompileOptions
    languages?: string[]
}

export interface CliConfig extends MailTranslationConfig {
    // CLI-specific options
    verbose?: boolean
    watch?: boolean
}

const moduleName = "mail-translation"

/**
 * Load configuration from various sources using lilconfig
 * Supports: package.json, .mailtranslationrc, .mailtranslationrc.json, .mailtranslationrc.js, mail-translation.config.js
 */
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

/**
 * Load configuration from a specific file path
 */
export async function loadConfigFromFile(filepath: string): Promise<CliConfig> {
    const explorer = lilconfig(moduleName)

    try {
        const result = await explorer.load(filepath)
        return result.config
    } catch (error) {
        throw new Error(`Failed to load configuration from ${filepath}: ${error}`)
    }
}

/**
 * Validate configuration object
 */
export function validateConfig(config: CliConfig): void {
    if (!config.translationsPath) {
        throw new Error("Configuration must specify translationsPath")
    }

    if (!config.mailsPath) {
        throw new Error("Configuration must specify mailsPath")
    }

    // Validate output mode if provided
    if (config.outputMode) {
        const validModes: OutputMode[] = ["kratos", "razor"]
        if (!validModes.includes(config.outputMode)) {
            throw new Error(`Invalid outputMode: ${config.outputMode}. Must be one of: ${validModes.join(", ")}`)
        }
    }

    // Validate MJML options if provided
    if (config.mjmlOptions?.validationLevel) {
        const validLevels = ["strict", "soft", "skip"]
        if (!validLevels.includes(config.mjmlOptions.validationLevel)) {
            throw new Error(
                `Invalid validationLevel: ${config.mjmlOptions.validationLevel}. Must be one of: ${validLevels.join(", ")}`,
            )
        }
    }
}

/**
 * Get default configuration
 */
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

/**
 * Merge configuration with defaults
 */
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

    // If plaintextMailsPath is not provided, use mailsPath as fallback
    if (!merged.plaintextMailsPath) {
        merged.plaintextMailsPath = merged.mailsPath
    }

    return merged
}
