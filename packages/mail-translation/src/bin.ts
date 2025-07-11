#!/usr/bin/env node
/* eslint-disable no-console */

import { Command } from "commander"
import * as path from "path"
import { generate } from "./generate"
import { CliConfig, loadConfig, loadConfigFromFile, mergeWithDefaults, OutputMode, validateConfig } from "./loadConfig"
import { saveOutputs } from "./saveOutputs"

const program = new Command()

interface CliOptions {
    config?: string
    translationsPath?: string
    mailsPath?: string
    outputPath?: string
    outputMode?: OutputMode
    defaultLanguage?: string
    language?: string
    languages?: string
    verbose?: boolean
    beautify?: boolean
    minify?: boolean
    validationLevel?: "skip" | "soft" | "strict"
}

async function translateMails(options: CliOptions): Promise<void> {
    try {
        let config: CliConfig

        if (options.config) {
            config = await loadConfigFromFile(options.config)
        } else {
            const loadedConfig = await loadConfig()
            config = loadedConfig || ({} as CliConfig)
        }

        if (options.translationsPath) config.translationsPath = options.translationsPath
        if (options.mailsPath) config.mailsPath = options.mailsPath
        if (options.outputPath) config.outputPath = options.outputPath
        if (options.outputMode) config.outputMode = options.outputMode
        if (options.defaultLanguage) config.defaultLanguage = options.defaultLanguage
        if (options.verbose !== undefined) config.verbose = options.verbose

        if (options.beautify !== undefined) {
            config.mjmlOptions = config.mjmlOptions || {}
            config.mjmlOptions.beautify = options.beautify
        }
        if (options.minify !== undefined) {
            config.mjmlOptions = config.mjmlOptions || {}
            config.mjmlOptions.minify = options.minify
        }
        if (options.validationLevel) {
            config.mjmlOptions = config.mjmlOptions || {}
            config.mjmlOptions.validationLevel = options.validationLevel
        }

        config = mergeWithDefaults(config)

        validateConfig(config)

        let languagesToProcess: string[] | undefined
        if (options.language) {
            languagesToProcess = [options.language]
        } else if (options.languages) {
            languagesToProcess = options.languages.split(",").map(lang => lang.trim())
        }

        const generateResult = await generate({
            config,
            languagesToProcess,
            verbose: config.verbose,
        })

        if (config.outputPath) {
            await saveOutputs(generateResult, config.outputPath)
            console.log(`✓ Translated mails saved to: ${path.resolve(config.outputPath)}`)
        }

        console.log("Mail translation completed successfully!")
    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error)
        process.exit(1)
    }
}

program
    .name("@leancodepl/mail-translation")
    .description("CLI tool for translating MJML email templates")
    .version("0.0.1")

program
    .command("translate")
    .description("Translate mail templates")
    .option("-c, --config <path>", "Path to configuration file")
    .option("-t, --translations-path <path>", "Path to translations directory")
    .option("-m, --mails-path <path>", "Path to mail templates directory")
    .option("-o, --output-path <path>", "Path to output directory")
    .option("--output-mode <mode>", "Output mode (kratos|razor)", "kratos")
    .option("--default-language <lang>", "Default language for templates", "en")
    .option("-l, --language <lang>", "Process only specific language")
    .option("--languages <langs>", "Process specific languages (comma-separated)")
    .option("-v, --verbose", "Enable verbose output")
    .option("--beautify", "Beautify HTML output")
    .option("--minify", "Minify HTML output")
    .option("--validation-level <level>", "MJML validation level (strict|soft|skip)", "soft")
    .action(translateMails)

program.arguments("[command]").action(cmd => {
    if (cmd) {
        program.outputHelp()
        process.exit(1)
    } else {
        translateMails({}).catch(error => {
            console.error("Error:", error instanceof Error ? error.message : error)
            process.exit(1)
        })
    }
})

program.parse()

if (process.argv.length === 2) {
    program.outputHelp()
}
