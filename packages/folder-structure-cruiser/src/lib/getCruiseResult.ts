import { cruise, ICruiseOptions, IFlattenedRuleSet, IReporterOutput, IResolveOptions } from "dependency-cruiser"
import extractTSConfig from "dependency-cruiser/config-utl/extract-ts-config"
import extractWebpackResolveConfig from "dependency-cruiser/config-utl/extract-webpack-resolve-config"
import { mergeWith } from "es-toolkit"
import type { CommandKey, FolderStructureCruiserConfig } from "./loadConfig"

export type GetCruiseResultParams = {
  directories: string[]
  config: FolderStructureCruiserConfig
  /**
   * Config section key of the running command. The matching section's `ignore`
   * patterns are merged on top of the global ones for this cruise.
   */
  command: CommandKey
  /**
   * dependency-cruiser rule set to validate. When absent, validation is off
   * and the cruise only produces the module graph.
   */
  ruleSet?: IFlattenedRuleSet
}

/**
 * Runs dependency-cruiser over `directories` with the built-in analysis
 * options, extended by the ignore patterns from the folder-structure-cruiser
 * config. dependency-cruiser is an implementation detail here — nothing of its
 * own configuration format leaks out.
 */
export async function getCruiseResult({
  directories,
  config,
  command,
  ruleSet,
}: GetCruiseResultParams): Promise<IReporterOutput> {
  const cruiseOptions = buildCruiseOptions({ config, command, ruleSet })

  const webpackConfig = config.webpackConfig ? await extractWebpackResolveConfig(config.webpackConfig) : undefined
  const tsConfig = config.tsConfig ? extractTSConfig(config.tsConfig) : undefined

  return await cruise(directories, cruiseOptions, webpackConfig as IResolveOptions, { tsConfig })
}

function buildCruiseOptions({
  config,
  command,
  ruleSet,
}: Pick<GetCruiseResultParams, "command" | "config" | "ruleSet">): ICruiseOptions {
  const ignorePatterns = [...builtinIgnorePatterns, ...(config.ignore ?? []), ...(config[command]?.ignore ?? [])]

  const baseOptions: ICruiseOptions = {
    doNotFollow: {
      path: ignorePatterns,
      dependencyTypes: ["npm-no-pkg", "npm-unknown"],
    },
    exclude: { path: ignorePatterns },
    ...(config.scope?.length ? { includeOnly: { path: config.scope } } : {}),
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
  }

  const mergedOptions = config.dependencyCruiserOptions
    ? mergeWith(baseOptions, config.dependencyCruiserOptions, (_, sourceValue) =>
        Array.isArray(sourceValue) ? sourceValue : undefined,
      )
    : baseOptions

  // The validation rule set / `validate` flag are owned
  // by the command and re-applied *after* the escape hatch, so a stray
  // `dependencyCruiserOptions` can never silently drop the built-in rules
  return {
    ...mergedOptions,
    ...(ruleSet ? { ruleSet, validate: true } : { validate: false }),
  }
}

const builtinIgnorePatterns = [
  "node_modules",
  "(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$",
  "[.]d[.]ts$",
  "(^|/)tsconfig[.]json$",
]
