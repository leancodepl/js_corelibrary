import extractDepcruiseOptions from "dependency-cruiser/config-utl/extract-depcruise-options"

type CruiseOptionsWithFolderStructureCruiser = {
  folderStructureCruiser?: {
    crossFeatureImports?: {
      allowImportsFromDirectChildrenOf?: string[]
    }
  }
}

export type FolderStructureCruiserConfig = {
  allowImportsFromDirectChildrenOf: string[]
}

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string") ? value : []
}

export async function getFolderStructureCruiserConfig(configPath: string): Promise<FolderStructureCruiserConfig> {
  if (!configPath) {
    return { allowImportsFromDirectChildrenOf: [] }
  }

  const depcruiseOptions = (await extractDepcruiseOptions(configPath)) as CruiseOptionsWithFolderStructureCruiser
  const allowImportsFromDirectChildrenOf = parseStringArray(
    depcruiseOptions.folderStructureCruiser?.crossFeatureImports?.allowImportsFromDirectChildrenOf,
  )

  return {
    allowImportsFromDirectChildrenOf,
  }
}
