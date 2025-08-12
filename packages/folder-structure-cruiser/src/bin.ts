#!/usr/bin/env node

import { program } from "commander"
import { validateCrossFeatureImports } from "./commands/validateCrossFeatureImports.js"
import { validateSharedComponent } from "./commands/validateSharedComponent.js"

program.name("folder-structure-cruiser").description("CLI tool for validating folder structure rules")

program
  .command("validate-shared-components")
  .description("Validate if shared components are located at the first shared level")
  .option("-d, --directory <dir>", "Directory to analyze", ".")
  .option("-c, --config <path_to_config>", "Path to config file")
  .option("-t, --tsConfig <path_to_ts_config>", "Path to ts config file")
  .option("-w, --webpackConfig <path_to_webpack_config>", "Path to webpack config file")

  .action(async options => {
    const directories = options.directory ? [options.directory] : [".*"]
    const configPath = options.config ?? ""
    const tsConfigPath = options.tsConfig
    const webpackConfigPath = options.webpackConfig

    await validateSharedComponent({ directories, configPath, tsConfigPath, webpackConfigPath })
  })

program
  .command("validate-cross-feature-imports")
  .description("Validate if cross-feature nested imports are allowed")
  .option("-d, --directory <dir>", "Directory to analyze", ".")
  .option("-c, --config <path_to_config>", "Path to config file")
  .option("-t, --tsConfig <path_to_ts_config>", "Path to ts config file")
  .option("-w, --webpackConfig <path_to_webpack_config>", "Path to webpack config file")
  .action(async options => {
    const directories = options.directory ? [options.directory] : [".*"]
    const configPath = options.config ?? ""
    const tsConfigPath = options.tsConfig
    const webpackConfigPath = options.webpackConfig

    await validateCrossFeatureImports({ directories, configPath, tsConfigPath, webpackConfigPath })
  })

program.parse()
