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
      "Path to config file (cyberware-contract-generator-dart.config.js or .cyberware-contract-generator-dartrc.json)",
  })
  .parseSync()

loadConfig(argv.config).then(({ config, outputDir }) => generate(config, outputDir))
