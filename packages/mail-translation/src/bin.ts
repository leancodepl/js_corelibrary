#!/usr/bin/env node

import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"
import { generate } from "./generate"
import { loadConfig } from "./loadConfig"
import { logger } from "./logger"
import { formatMailTranslationError } from "./MailTranslationError"
import { saveOutputs } from "./saveOutputs"

const argv = yargs(hideBin(process.argv))
  .option("config", {
    alias: "c",
    type: "string",
    description: "Config file location",
  })
  .parseSync()

main().catch(error => {
  logger.error("Unexpected error:", error as Error)
  process.exit(1)
})

async function main() {
  const configResult = loadConfig(argv.config)
  if (configResult.isErr()) {
    logger.error(formatMailTranslationError(configResult.error))
    process.exit(1)
  }
  const config = configResult.value

  const generateResult = await generate(config)
  if (generateResult.isErr()) {
    logger.error(formatMailTranslationError(generateResult.error))
    process.exit(1)
  }

  await saveOutputs({ processedTemplates: generateResult.value, outputPath: config.outputPath })
}
