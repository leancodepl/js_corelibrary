#!/usr/bin/env node

import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"
import { generate } from "./generate"
import { loadConfig } from "./loadConfig"

const argv = yargs(hideBin(process.argv))
  .option("config", {
    alias: "c",
    type: "string",
    description:
      "Path to config file (iframe-contract-dart-generator.config.js or .iframe-contract-dart-generatorrc.json)",
  })
  .parseSync()

loadConfig(argv.config).then(({ config, outputDir }) => generate(config, outputDir))
