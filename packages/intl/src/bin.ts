#!/usr/bin/env node

import { program } from "commander"
import { z } from "zod/v4"
import { diff, diffCommandOptionsSchema } from "./commands/diff"
import { download, downloadCommandOptionsSchema } from "./commands/download"
import { local, localCommandOptionsSchema } from "./commands/local"
import { sync, syncCommandOptionsSchema } from "./commands/sync"
import { upload, uploadCommandOptionsSchema } from "./commands/upload"
import { logger } from "./logger"
import { mergeWithEnv } from "./mergeWithEnv"
import { mkTranslationsServiceClient } from "./mkTranslationsServiceClient"

const translationsServiceOptionsSchema = z.object({
  poeditorApiToken: z.string().optional(),
  poeditorProjectId: z.number().optional(),
})

program.name("intl").description("CLI tool for managing formatjs translations with translation services")

program
  .command("local")
  .description("Extract, download from translation service, and compile formatjs translations locally")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/!(*.d).{ts,tsx}")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-d, --default-language <lang>", "Default language for translations")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .action(async (options: unknown) => {
    const parsedOptions = localCommandOptionsSchema.extend(translationsServiceOptionsSchema.shape).parse(options)

    const config = mergeWithEnv(parsedOptions)

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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/!(*.d).{ts,tsx}")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations")
  .action(async (options: unknown) => {
    const parsedOptions = uploadCommandOptionsSchema.extend(translationsServiceOptionsSchema.shape).parse(options)

    const config = mergeWithEnv(parsedOptions)

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
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .action(async (options: unknown) => {
    const parsedOptions = downloadCommandOptionsSchema.extend(translationsServiceOptionsSchema.shape).parse(options)

    const config = mergeWithEnv(parsedOptions)

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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/!(*.d).{ts,tsx}")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-l, --languages <langs...>", "Languages to download")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .option("-d, --default-language <lang>", "Default language for translations")
  .action(async (options: unknown) => {
    const parsedOptions = syncCommandOptionsSchema.extend(translationsServiceOptionsSchema.shape).parse(options)

    const config = mergeWithEnv(parsedOptions)

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
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/!(*.d).{ts,tsx}")
  .option("-t, --poeditor-api-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => Number.parseInt(value, 10))
  .action(async (options: unknown) => {
    const parsedOptions = diffCommandOptionsSchema.extend(translationsServiceOptionsSchema.shape).parse(options)

    const config = mergeWithEnv(parsedOptions)

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
