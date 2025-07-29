#!/usr/bin/env node

import { program } from "commander"
import { diff } from "./commands/diff"
import { download } from "./commands/download"
import { local } from "./commands/local"
import { sync } from "./commands/sync"
import { upload } from "./commands/upload"
import { mergeWithEnv } from "./config"
import { mkTranslationsServiceClient } from "./mkTranslationsServiceClient"

program.name("intl").description("CLI tool for managing formatjs translations with translation services")

program
  .command("local")
  .description("Extract, download from translation service, and compile formatjs translations locally")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-d, --default-language <lang>", "Default language for translations", "en")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .action(async options => {
    const config = mergeWithEnv({
      srcPattern: options.srcPattern,
      outputDir: options.outputDir,
      defaultLanguage: options.defaultLanguage,
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    const translationsServiceClient =
      config.poeditorApiToken && config.poeditorProjectId
        ? mkTranslationsServiceClient({
            config: {
              poeditorApiToken: config.poeditorApiToken,
              poeditorProjectId: config.poeditorProjectId,
            },
          })
        : undefined

    await local({
      srcPattern: config.srcPattern,
      outputDir: config.outputDir,
      defaultLanguage: config.defaultLanguage,
      translationsServiceClient,
    })
  })

program
  .command("upload")
  .description("Extract terms and upload to translation service")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations", "en")
  .action(async options => {
    const config = mergeWithEnv({
      srcPattern: options.srcPattern,
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
      defaultLanguage: options.defaultLanguage,
    })

    if (!config.poeditorApiToken || !config.poeditorProjectId) {
      console.error("Translation service API token and project ID are required for upload command")
      process.exit(1)
    }

    const translationsServiceClient = mkTranslationsServiceClient({
      config: {
        poeditorApiToken: config.poeditorApiToken,
        poeditorProjectId: config.poeditorProjectId,
      },
    })

    await upload({
      srcPattern: config.srcPattern,
      translationsServiceClient,
      defaultLanguage: config.defaultLanguage,
    })
  })

program
  .command("download")
  .description("Download translations from translation service and compile them")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .action(async options => {
    const config = mergeWithEnv({
      outputDir: options.outputDir,
      languages: options.languages || ["en", "pl"],
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    if (!config.poeditorApiToken || !config.poeditorProjectId) {
      console.error("Translation service API token and project ID are required for download command")
      process.exit(1)
    }

    const translationsServiceClient = mkTranslationsServiceClient({
      config: {
        poeditorApiToken: config.poeditorApiToken,
        poeditorProjectId: config.poeditorProjectId,
      },
    })

    await download({
      outputDir: config.outputDir,
      languages: config.languages,
      translationsServiceClient,
    })
  })

program
  .command("sync")
  .description("Upload local changes and download updated translations")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations", "en")
  .action(async options => {
    const config = mergeWithEnv({
      srcPattern: options.srcPattern,
      outputDir: options.outputDir,
      languages: options.languages || ["en", "pl"],
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
      defaultLanguage: options.defaultLanguage,
    })

    if (!config.poeditorApiToken || !config.poeditorProjectId) {
      console.error("Translation service API token and project ID are required for sync command")
      process.exit(1)
    }

    const translationsServiceClient = mkTranslationsServiceClient({
      config: {
        poeditorApiToken: config.poeditorApiToken,
        poeditorProjectId: config.poeditorProjectId,
      },
    })

    await sync({
      srcPattern: config.srcPattern,
      outputDir: config.outputDir,
      languages: config.languages,
      translationsServiceClient,
      defaultLanguage: config.defaultLanguage,
    })
  })

program
  .command("diff")
  .description("Compare local terms with translation service to find unused terms")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .action(async options => {
    const config = mergeWithEnv({
      srcPattern: options.srcPattern,
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    if (!config.poeditorApiToken || !config.poeditorProjectId) {
      console.error("Translation service API token and project ID are required for diff command")
      process.exit(1)
    }

    const translationsServiceClient = mkTranslationsServiceClient({
      config: {
        poeditorApiToken: config.poeditorApiToken,
        poeditorProjectId: config.poeditorProjectId,
      },
    })

    await diff({
      srcPattern: config.srcPattern,
      translationsServiceClient,
    })
  })

program.parse()
