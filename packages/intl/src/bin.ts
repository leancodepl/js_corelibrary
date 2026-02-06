#!/usr/bin/env node

import { program } from "commander"
import { z } from "zod/v4"
import { diff, diffCommandOptionsSchema } from "./commands/diff"
import { download, downloadCommandOptionsSchema } from "./commands/download"
import { local, localCommandOptionsSchema } from "./commands/local"
import { sync, syncCommandOptionsSchema } from "./commands/sync"
import { upload, uploadCommandOptionsSchema } from "./commands/upload"
import { intlConfigSchema, loadConfig } from "./loadConfig"
import { logger } from "./logger"
import { mergeWithEnv } from "./mergeWithEnv"
import { mkTranslationsServiceClient } from "./mkTranslationsServiceClient"

const cliOptionsSchema = intlConfigSchema.extend({
  config: z.string().optional(),
})

function getConfig(cliOptions: z.infer<typeof cliOptionsSchema>) {
  const fileConfig = loadConfig(cliOptions.config)

  return {
    srcPattern: cliOptions.srcPattern ?? fileConfig?.srcPattern ?? "src/**/!(*.d).{ts,tsx}",
    outputDir: cliOptions.outputDir ?? fileConfig?.outputDir ?? "lang",
    defaultLanguage: cliOptions.defaultLanguage ?? fileConfig?.defaultLanguage,
    languages: cliOptions.languages ?? fileConfig?.languages,
    poeditorApiToken: cliOptions.poeditorApiToken ?? fileConfig?.poeditorApiToken,
    poeditorProjectId: cliOptions.poeditorProjectId ?? fileConfig?.poeditorProjectId,
  }
}

program.name("intl").description("CLI tool for managing formatjs translations with translation services")

program
  .command("local")
  .description("Extract, download from translation service, and compile formatjs translations locally")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations")
  .option("-d, --default-language <lang>", "Default language for translations")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-c, --config <path>", "Path to config file")
  .action(async options => {
    const cliOptions = cliOptionsSchema.parse(options)
    const merged = getConfig(cliOptions)
    const parsedOptions = localCommandOptionsSchema.parse(merged)
    const config = mergeWithEnv({ ...merged, ...parsedOptions })

    const translationsServiceClient =
      config.poeditorApiToken && config.poeditorProjectId
        ? mkTranslationsServiceClient({
            poeditorApiToken: config.poeditorApiToken,
            poeditorProjectId: config.poeditorProjectId,
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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations")
  .option("-c, --config <path>", "Path to config file")
  .action(async options => {
    const cliOptions = cliOptionsSchema.parse(options)
    const merged = getConfig(cliOptions)
    const parsedOptions = uploadCommandOptionsSchema.parse(merged)
    const config = mergeWithEnv({ ...merged, ...parsedOptions })

    if (!config.poeditorApiToken || !config.poeditorProjectId) {
      logger.error("Translation service API token and project ID are required for upload command")
      process.exit(1)
    }

    const translationsServiceClient = mkTranslationsServiceClient({
      poeditorApiToken: config.poeditorApiToken,
      poeditorProjectId: config.poeditorProjectId,
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
  .option("-o, --output-dir <dir>", "Output directory for compiled translations")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-c, --config <path>", "Path to config file")
  .action(async options => {
    const cliOptions = cliOptionsSchema.parse(options)
    const merged = getConfig(cliOptions)
    const parsedOptions = downloadCommandOptionsSchema.parse(merged)
    const config = mergeWithEnv({ ...merged, ...parsedOptions })

    const translationsServiceClient = mkTranslationsServiceClient({
      poeditorApiToken: config.poeditorApiToken,
      poeditorProjectId: config.poeditorProjectId,
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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations")
  .option("-c, --config <path>", "Path to config file")
  .action(async options => {
    const cliOptions = cliOptionsSchema.parse(options)
    const merged = getConfig(cliOptions)
    const parsedOptions = syncCommandOptionsSchema.parse(merged)
    const config = mergeWithEnv({ ...merged, ...parsedOptions })

    const translationsServiceClient = mkTranslationsServiceClient({
      poeditorApiToken: config.poeditorApiToken,
      poeditorProjectId: config.poeditorProjectId,
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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-c, --config <path>", "Path to config file")
  .action(async options => {
    const cliOptions = cliOptionsSchema.parse(options)
    const merged = getConfig(cliOptions)
    const parsedOptions = diffCommandOptionsSchema.parse(merged)
    const config = mergeWithEnv({ ...merged, ...parsedOptions })

    const translationsServiceClient = mkTranslationsServiceClient({
      poeditorApiToken: config.poeditorApiToken,
      poeditorProjectId: config.poeditorProjectId,
    })

    await diff({
      srcPattern: config.srcPattern,
      translationsServiceClient,
    })
  })

program.parse()
