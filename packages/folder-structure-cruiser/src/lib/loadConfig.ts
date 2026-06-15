import { ICruiseOptions } from "dependency-cruiser"
import { lilconfig } from "lilconfig"
import { existsSync } from "node:fs"
import { dirname, resolve as resolvePath } from "node:path"
import { z } from "zod"
import { CommandConfig, commandConfigSchema } from "./commandConfigSchema"
import { regexPatternSchema } from "./configValidation"

export type { CommandConfig } from "./commandConfigSchema"

// Every command currently adds no options of its own beyond the shared command
// section, so they all reuse it directly.
export type CrossFeatureImportsConfig = CommandConfig
export type NoOrphansConfig = CommandConfig
export type SharedComponentsConfig = CommandConfig

/**
 * Full config schema; each validate-* command owns its own section schema.
 *
 * folder-structure-cruiser's own configuration, loaded from
 * `folder-structure-cruiser.config.{json,mjs,js,cjs}`. The underlying
 * dependency-cruiser setup is an implementation detail — built-in analysis
 * options cover the common case and this config only customizes what varies
 * between projects.
 */
const packageName = "folder-structure-cruiser"

const configSchema = z.strictObject({
  /** Path to a tsconfig for path-alias resolution, relative to the config file. */
  tsConfig: z.string().optional(),
  /** Path to a webpack config for alias resolution, relative to the config file. */
  webpackConfig: z.string().optional(),
  /**
   * Ignore patterns applied to every command, on top of the built-in ignores
   * (`node_modules`, dotfile configs, `.d.ts`, `tsconfig.json`). Each entry is
   * a regular expression matched against module paths relative to the working
   * directory.
   */
  ignore: z.array(regexPatternSchema).optional(),
  /**
   * When set, only modules matching one of these patterns take part in the
   * analysis — everything else (including imports of Node built-ins and npm
   * packages) is left out. Each entry is a regular expression matched against
   * module paths relative to the working directory, e.g. `["^src/"]`.
   */
  scope: z.array(regexPatternSchema).optional(),
  crossFeatureImports: commandConfigSchema.optional(),
  sharedComponents: commandConfigSchema.optional(),
  noOrphans: commandConfigSchema.optional(),
  /**
   * Escape hatch: raw dependency-cruiser cruise options, deep-merged over the
   * built-in options after `ignore`/`scope` are applied (objects merge
   * recursively, arrays and scalars replace). Not validated by
   * folder-structure-cruiser; prefer `ignore`/`scope` when they suffice.
   */
  dependencyCruiserOptions: z.custom<ICruiseOptions>().optional(),
})

export type FolderStructureCruiserConfig = z.infer<typeof configSchema>

/** Config keys that hold a validate-* command's section. */
export type CommandKey = "crossFeatureImports" | "noOrphans" | "sharedComponents"

/** lilconfig handles discovery and loading for the config file names we support. */
const searchOptions = {
  searchPlaces: [
    `${packageName}.config.json`,
    `${packageName}.config.mjs`,
    `${packageName}.config.js`,
    `${packageName}.config.cjs`,
  ],
}

/**
 * Loads and validates the folder-structure-cruiser config.
 *
 * `tsConfig` and `webpackConfig` paths are resolved relative to the config
 * file's directory, so the returned config carries absolute paths.
 */
export async function loadConfig(configPath?: string): Promise<FolderStructureCruiserConfig> {
  if (configPath && !existsSync(configPath)) {
    throw new Error(`Config file not found at ${resolvePath(process.cwd(), configPath)}`)
  }

  // Only the working directory is searched — never ancestors. `ignore`/`scope`
  // patterns match module paths relative to the working directory, so a config
  // picked up from a parent dir would carry patterns that silently fail to
  // match.
  const searcher = lilconfig(packageName, { ...searchOptions, stopDir: process.cwd() })
  const result = configPath ? await searcher.load(configPath) : await searcher.search()

  if (!result || result.isEmpty) {
    return {}
  }

  const config = configSchema.parse(result.config)

  const configDirectory = dirname(result.filepath)

  return {
    ...config,
    tsConfig: config.tsConfig === undefined ? undefined : resolvePath(configDirectory, config.tsConfig),
    webpackConfig: config.webpackConfig === undefined ? undefined : resolvePath(configDirectory, config.webpackConfig),
  }
}
