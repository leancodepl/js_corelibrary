import {
  CreateNodesContext,
  createNodesFromFiles,
  CreateNodesV2,
  joinPathFragments,
  TargetConfiguration,
} from "@nx/devkit"
import { dirname } from "path"

const contractsConfigGlob = "**/contractsgenerator-typescript.config.js"

export interface ContractsPluginOptions {
  targetName?: string
}

export const createNodesV2: CreateNodesV2<ContractsPluginOptions> = [
  contractsConfigGlob,
  async (configFiles, options, context) =>
    createNodesFromFiles(
      (configFile, options, context) => createNodesInternal(configFile, options ?? {}, context),
      configFiles,
      options,
      context,
    ),
]

function createNodesInternal(configFilePath: string, options: ContractsPluginOptions, _context: CreateNodesContext) {
  const projectRoot = dirname(configFilePath)
  const targetName = options.targetName ?? "contracts"

  const contractsTarget: TargetConfiguration = {
    command: "npx @leancodepl/contractsgenerator-typescript --no-install",
    options: {
      cwd: joinPathFragments("{projectRoot}"),
    },
    cache: true,
  }

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [targetName]: contractsTarget,
        },
      },
    },
  }
}
