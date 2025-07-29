#!/usr/bin/env node

import { program } from "commander"
import { diff } from "./commands/diff"
import { download } from "./commands/download"
import { local } from "./commands/local"
import { sync } from "./commands/sync"
import { upload } from "./commands/upload"
import { mergeWithEnv } from "./config"

program.name("intl").description("CLI tool for managing formatjs translations with POEditor integration")

program
  .command("local")
  .description("Extract and compile formatjs translations locally (no POEditor integration)")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-o, --output-dir <dir>", "Output directory for compiled translations", "lang")
  .option("-d, --default-language <lang>", "Default language for translations", "en")
  .action(async options => {
    await local({
      srcPattern: options.srcPattern,
      outputDir: options.outputDir,
      defaultLanguage: options.defaultLanguage,
    })
  })

program
  .command("upload")
  .description("Extract terms and upload to POEditor")
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

    await upload(config)
  })

program
  .command("download")
  .description("Download translations from POEditor and compile them")
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

    await download(config)
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

    await sync(config)
  })

program
  .command("diff")
  .description("Compare local terms with POEditor to find unused terms")
  .option("-s, --src-pattern <pattern>", "Source file pattern for extraction", "src/**/*.{ts,tsx}")
  .option("-t, --poeditor-token <token>", "POEditor API token (can also use POEDITOR_API_TOKEN env var)")
  .option("-p, --poeditor-project-id <id>", "POEditor project ID", value => parseInt(value, 10))
  .action(async options => {
    const config = mergeWithEnv({
      srcPattern: options.srcPattern,
      poeditorApiToken: options.poeditorToken,
      poeditorProjectId: options.poeditorProjectId,
    })

    await diff(config)
  })

program.parse()
