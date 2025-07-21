#!/usr/bin/env node

import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"
import { generate } from "./generate"
import { loadConfig } from "./loadConfig"
import { saveOutputs } from "./saveOutputs"

const argv = yargs(hideBin(process.argv))
    .option("config", {
        alias: "c",
        type: "string",
        description: "Config file location",
    })
    .parseSync()

const config = loadConfig(argv.config)

generate(config).then(templates => saveOutputs(templates, config.outputPath))
