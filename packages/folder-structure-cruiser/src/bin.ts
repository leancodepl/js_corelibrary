#!/usr/bin/env node

import { Command } from "commander"
import { addValidateCommand } from "./addValidateCommand"
import { validateCrossFeatureImports } from "./commands/validateCrossFeatureImports"
import { validateNoOrphans } from "./commands/validateNoOrphans"
import { validateSharedComponent } from "./commands/validateSharedComponent"
import { logger } from "./lib/logger"

const program = new Command()

program.name("folder-structure-cruiser").description("CLI tool for validating folder structure rules")

addValidateCommand(program, {
  name: "validate-shared-components",
  description: "Validate if shared components are located at the first shared level",
  validate: validateSharedComponent,
})

addValidateCommand(program, {
  name: "validate-cross-feature-imports",
  description: "Validate if cross-feature nested imports are allowed",
  validate: validateCrossFeatureImports,
})

addValidateCommand(program, {
  name: "validate-no-orphans",
  description: "Validate that no orphaned modules exist",
  validate: validateNoOrphans,
})

program.parseAsync().catch((error: unknown) => {
  logger.error(error instanceof Error ? error : new Error(String(error)))
  process.exitCode = 1
})
