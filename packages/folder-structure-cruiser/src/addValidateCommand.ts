import { Command } from "commander"
import { ValidateParams } from "./lib/validateParams"

type ValidateCommandSpec = {
  name: string
  description: string
  validate: (params: ValidateParams) => Promise<number>
}

/**
 * Registers a `validate-*` subcommand with the options shared by every command
 * and an action that runs `validate` and sets the exit code on violations.
 */
export function addValidateCommand(program: Command, { name, description, validate }: ValidateCommandSpec) {
  program
    .command(name)
    .description(description)
    .option("-d, --directory <dir>", "Directory to analyze", ".")
    .option(
      "-c, --config <path_to_config>",
      "Path to a folder-structure-cruiser config file (defaults to folder-structure-cruiser.config.{json,mjs,js,cjs} in the working directory)",
    )
    .action(async options => {
      const violationsCount = await validate({
        directories: options.directory ? [options.directory] : [".*"],
        configPath: options.config,
      })

      handleCommandResult(violationsCount)
    })
}

function handleCommandResult(violationsCount: number) {
  if (violationsCount > 0) {
    process.exitCode = 1
  }
}
