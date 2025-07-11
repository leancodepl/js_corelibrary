#!/usr/bin/env node
/* eslint-disable no-console */

import { Command } from "commander"
import * as path from "path"
import {
    CliConfig,
    loadConfig,
    loadConfigFromFile,
    mergeWithDefaults,
    OutputMode,
    validateConfig,
} from "./lib/loadConfig"
import { loadTranslations, TranslationData } from "./lib/loadTranslations"
import { ProcessedTemplate, processTemplate, Template } from "./lib/processTemplate"
import { saveOutputs } from "./lib/saveOutputs"
import { loadPlaintextTemplates, loadTemplates } from "./lib/templateLoader"

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
        // Load configuration
        let config: CliConfig

        if (options.config) {
            config = await loadConfigFromFile(options.config)
        } else {
            const loadedConfig = await loadConfig()
            config = loadedConfig || ({} as CliConfig)
        }

        // Override config with CLI options
        if (options.translationsPath) config.translationsPath = options.translationsPath
        if (options.mailsPath) config.mailsPath = options.mailsPath
        if (options.outputPath) config.outputPath = options.outputPath
        if (options.outputMode) config.outputMode = options.outputMode
        if (options.defaultLanguage) config.defaultLanguage = options.defaultLanguage
        if (options.verbose !== undefined) config.verbose = options.verbose

        // Handle MJML options
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

        // Merge with defaults
        config = mergeWithDefaults(config)

        // Validate configuration
        validateConfig(config)

        if (config.verbose) {
            console.log("Configuration:", JSON.stringify(config, null, 2))
        }

        // Load translations
        let translationData: TranslationData = {}
        if (config.translationsPath) {
            translationData = await loadTranslations(config.translationsPath)
        } else {
            console.warn("No translations path provided. Continuing without translations.")
        }

        // Load templates
        const mjmlTemplates = await loadTemplates(config.mailsPath)
        const plaintextTemplates = await loadPlaintextTemplates(
            config.plaintextMailsPath || config.mailsPath,
            config.outputMode,
        )

        const availableLanguages = Object.keys(translationData)
        const hasTranslations = availableLanguages.length > 0

        if (config.verbose) {
            console.log("Available languages:", hasTranslations ? availableLanguages : [config.defaultLanguage])
        }

        // Check if we have any translations loaded
        if (!hasTranslations) {
            console.log("No translations found. Processing templates without translations.")
        }

        // Determine which languages to process
        let languagesToProcess: string[]
        if (options.language) {
            languagesToProcess = [options.language]
        } else if (options.languages) {
            languagesToProcess = options.languages.split(",").map(lang => lang.trim())
        } else if (config.languages) {
            languagesToProcess = config.languages
        } else {
            languagesToProcess = hasTranslations ? availableLanguages : [config.defaultLanguage]
        }

        // Validate languages
        const allAvailableLanguages = hasTranslations ? availableLanguages : [config.defaultLanguage]
        for (const lang of languagesToProcess) {
            if (!allAvailableLanguages.includes(lang)) {
                throw new Error(
                    `Language '${lang}' not found. Available languages: ${allAvailableLanguages.join(", ")}`,
                )
            }
        }

        console.log(`Processing languages: ${languagesToProcess.join(", ")}`)
        console.log(`Output mode: ${config.outputMode}`)
        console.log(`Default language: ${config.defaultLanguage}`)

        // Process each template
        const processedTemplates: ProcessedTemplate[] = []

        for (const [templateName, mjmlContent] of Object.entries(mjmlTemplates)) {
            if (config.verbose) {
                console.log(`Processing template: ${templateName}`)
            }

            const template: Template = {
                name: templateName,
                mjml: mjmlContent,
                plaintext: plaintextTemplates[templateName],
            }

            // Process template - this now includes output template generation
            const processedTemplate = processTemplate(template, translationData, {
                outputMode: config.outputMode,
                defaultLanguage: config.defaultLanguage,
                mjmlOptions: {
                    ...config.mjmlOptions,
                    filePath: config.mailsPath,
                },
            })

            processedTemplates.push(processedTemplate)
        }

        // Log results
        for (const language of languagesToProcess) {
            const templatesForLanguage = processedTemplates.filter(pt => pt.translatedMails[language])
            console.log(`✓ ${language}: ${templatesForLanguage.length} templates processed`)

            // Log errors if any
            for (const processedTemplate of templatesForLanguage) {
                const translatedMail = processedTemplate.translatedMails[language]
                if (translatedMail && translatedMail.errors.length > 0) {
                    console.warn(`  ⚠ ${translatedMail.name}: ${translatedMail.errors.length} errors`)
                    if (config.verbose) {
                        translatedMail.errors.forEach((error: any) => {
                            console.warn(`    - Line ${error.line}: ${error.message}`)
                        })
                    }
                }
            }
        }

        // Save processed templates
        if (config.outputPath) {
            await saveOutputs(processedTemplates, config.outputPath)
            console.log(`✓ Translated mails saved to: ${path.resolve(config.outputPath)}`)
        }

        console.log("Mail translation completed successfully!")
    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error)
        process.exit(1)
    }
}

// CLI setup
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

// Set default command to translate
program.arguments("[command]").action(cmd => {
    if (cmd) {
        program.outputHelp()
        process.exit(1)
    } else {
        // If no command is provided, run translate with no options
        translateMails({}).catch(error => {
            console.error("Error:", error instanceof Error ? error.message : error)
            process.exit(1)
        })
    }
})

// Parse arguments
program.parse()

// If no arguments provided, show help
if (process.argv.length === 2) {
    program.outputHelp()
}
