#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { validateCrossFeatureImports } from "./validateCrossFeatureImports.js"
import { validateSharedComponent } from "./validateSharedComponent.js"

yargs(hideBin(process.argv))
  .command({
    command: "validate-shared-components",
    describe: "Validate if shared components are located at the first shared level",
    builder: yargs =>
      yargs
        .option("directory", {
          alias: "d",
          type: "string",
          description: "Directory to analyze",
          default: ".",
        })
        .option("exclude", {
          alias: "e",
          type: "array",
          description: "Paths to exclude from analysis",
          default: [],
        }),
    handler: argv => {
      // Extract directories and exclude paths
      const directories = argv.directory ? [argv.directory] : argv._.length > 0 ? argv._.map(String) : [".*"]
      const excludePaths = argv.exclude as string[]

      validateSharedComponent(directories, excludePaths)
    },
  })
  .command({
    command: "validate-cross-feature-imports",
    describe: "Validate if cross-feature nested imports are allowed",
    builder: yargs =>
      yargs
        .option("directory", {
          alias: "d",
          type: "string",
          description: "Directory to analyze",
          default: ".",
        })
        .option("exclude", {
          alias: "e",
          type: "array",
          description: "Paths to exclude from analysis",
          default: [],
        }),
    handler: argv => {
      // Extract directories and exclude paths
      const directories = argv.directory ? [argv.directory] : argv._.length > 0 ? argv._.map(String) : [".*"]
      const excludePaths = argv.exclude as string[]

      validateCrossFeatureImports(directories, excludePaths)
    },
  })
  .help()
  .alias("help", "h")
  .parseSync()
