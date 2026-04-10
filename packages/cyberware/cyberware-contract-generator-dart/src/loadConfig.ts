import { lilconfig } from "lilconfig"
import path from "node:path"
import { CyberwareContractGeneratorDartConfig, cyberwareContractGeneratorDartConfigSchema } from "./config"

const packageName = "cyberware-contract-generator-dart"

const searchOptions = {
  searchPlaces: [`${packageName}.config.js`, `${packageName}.config.cjs`, `${packageName}.config.mjs`],
}

export function resolveOutputDir(config: CyberwareContractGeneratorDartConfig, configDir: string): string {
  return path.isAbsolute(config.outputDir) ? config.outputDir : path.resolve(configDir, config.outputDir)
}

export async function loadConfig(configPath?: string) {
  const searcher = lilconfig(packageName, searchOptions)
  const result = configPath ? await searcher.load(configPath) : await searcher.search()

  if (!result) {
    throw new Error(
      `No config found. Create ${packageName}.config.js (or .${packageName}rc.json) with schema and outputDir, or pass --config <path>.`,
    )
  }

  const config = cyberwareContractGeneratorDartConfigSchema.parse(result.config)
  const configDir = path.dirname(result.filepath ?? process.cwd())
  const outputDir = resolveOutputDir(config, configDir)

  return { config, outputDir }
}
