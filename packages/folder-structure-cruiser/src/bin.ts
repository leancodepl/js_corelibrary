#!/usr/bin/env node

import { program } from "commander"
import { validateCrossFeatureImports } from "./commands/validateCrossFeatureImports.js"
import { validateSharedComponent } from "./commands/validateSharedComponent.js"

program.name("folder-structure-cruiser").description("CLI tool for validating folder structure rules")

program
  .command("validate-shared-components")
  .description("Validate if shared components are located at the first shared level")
  .option("-d, --directory <dir>", "Directory to analyze", ".")
  .option("-e, --exclude <paths...>", "Paths to exclude from analysis", [])
  .option("-t, --tsConfig <path_to_ts_config>", "Path to ts config file")

  .action(async options => {
    const directories = options.directory ? [options.directory] : [".*"]
    const excludePaths = options.exclude || []
    const tsConfigPath = options.tsConfig

    await validateSharedComponent({ directories, excludePaths, tsConfigPath })
  })

program
  .command("validate-cross-feature-imports")
  .description("Validate if cross-feature nested imports are allowed")
  .option("-d, --directory <dir>", "Directory to analyze", ".")
  .option("-e, --exclude <paths...>", "Paths to exclude from analysis", [])
  .option("-t, --tsConfig <path_to_ts_config>", "Path to ts config file")
  .action(async options => {
    const directories = options.directory ? [options.directory] : [".*"]
    const excludePaths = options.exclude || []
    const tsConfigPath = options.tsConfig

    await validateCrossFeatureImports({ directories, excludePaths, tsConfigPath })
  })

program.parse()
