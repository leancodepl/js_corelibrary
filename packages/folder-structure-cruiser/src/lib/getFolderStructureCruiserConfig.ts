import json5 from "json5"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, extname, isAbsolute, resolve } from "node:path"
import { pathToFileURL } from "node:url"

type FolderStructureCruiserConfigShape = {
  extends?: string | string[]
  folderStructureCruiser?: {
    crossFeatureImports?: {
      allowImportsFromDirectChildrenOf?: string[]
    }
  }
}

export type FolderStructureCruiserConfig = {
  allowImportsFromDirectChildrenOf: string[]
}

const require = createRequire(import.meta.url)

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string") ? value : []
}

async function readConfig(configPath: string): Promise<FolderStructureCruiserConfigShape> {
  const configFileExtension = extname(configPath)

  if (["", ".cjs", ".js", ".mjs"].includes(configFileExtension)) {
    const importedConfig = (await import(pathToFileURL(configPath).href)) as { default?: unknown }
    return (importedConfig.default ?? importedConfig) as FolderStructureCruiserConfigShape
  }

  const rawConfig = await readFile(configPath, "utf8")
  return json5.parse(rawConfig) as FolderStructureCruiserConfigShape
}

function resolveConfigPath(configPath: string, baseDirectory: string): string {
  if (isAbsolute(configPath)) {
    return configPath
  }

  return require.resolve(configPath, { paths: [baseDirectory] })
}

async function collectAllowImportsFromDirectChildrenOf(
  configPath: string,
  visitedConfigs = new Set<string>(),
): Promise<string[]> {
  const resolvedConfigPath = resolveConfigPath(configPath, process.cwd())

  if (visitedConfigs.has(resolvedConfigPath)) {
    return []
  }

  visitedConfigs.add(resolvedConfigPath)
  const config = await readConfig(resolvedConfigPath)
  const configDirectory = dirname(resolvedConfigPath)
  const inheritedConfigPaths = Array.isArray(config.extends) ? config.extends : config.extends ? [config.extends] : []
  const inheritedAllowedImportsNested = await Promise.all(
    inheritedConfigPaths.map(inheritedConfigPath =>
      collectAllowImportsFromDirectChildrenOf(resolveConfigPath(inheritedConfigPath, configDirectory), visitedConfigs),
    ),
  )
  const inheritedAllowedImports = inheritedAllowedImportsNested.flat()
  const localAllowedImports = parseStringArray(
    config.folderStructureCruiser?.crossFeatureImports?.allowImportsFromDirectChildrenOf,
  )

  return [...new Set([...inheritedAllowedImports, ...localAllowedImports])]
}

export async function getFolderStructureCruiserConfig(configPath: string): Promise<FolderStructureCruiserConfig> {
  if (!configPath) {
    return { allowImportsFromDirectChildrenOf: [] }
  }

  const allowImportsFromDirectChildrenOf = await collectAllowImportsFromDirectChildrenOf(resolve(configPath))

  return {
    allowImportsFromDirectChildrenOf,
  }
}
