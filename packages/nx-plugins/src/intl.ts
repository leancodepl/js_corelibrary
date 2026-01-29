import {
  CreateNodesContext,
  createNodesFromFiles,
  CreateNodesV2,
  joinPathFragments,
  TargetConfiguration,
} from "@nx/devkit"
import { dirname } from "path"

const intlConfigGlob = "**/intl.config.{js,cjs}"

export interface IntlPluginOptions {
  localTargetName?: string
  uploadTargetName?: string
  downloadTargetName?: string
  syncTargetName?: string
  diffTargetName?: string
}

export const createNodesV2: CreateNodesV2<IntlPluginOptions> = [
  intlConfigGlob,
  async (configFiles, options, context) =>
    createNodesFromFiles(
      (configFile, options, context) => createNodesInternal(configFile, options ?? {}, context),
      configFiles,
      options,
      context,
    ),
]

function createNodesInternal(configFilePath: string, options: IntlPluginOptions, _context: CreateNodesContext) {
  const projectRoot = dirname(configFilePath)

  const localTargetName = options.localTargetName ?? "intl"
  const uploadTargetName = options.uploadTargetName ?? "intl-upload"
  const downloadTargetName = options.downloadTargetName ?? "intl-download"
  const syncTargetName = options.syncTargetName ?? "intl-sync"
  const diffTargetName = options.diffTargetName ?? "intl-diff"

  const baseOptions = {
    cwd: joinPathFragments("{projectRoot}"),
  }

  const localTarget: TargetConfiguration = {
    command: "npx @leancodepl/intl local",
    options: baseOptions,
  }

  const uploadTarget: TargetConfiguration = {
    command: "npx @leancodepl/intl upload",
    options: baseOptions,
  }

  const downloadTarget: TargetConfiguration = {
    command: "npx @leancodepl/intl download",
    options: baseOptions,
  }

  const syncTarget: TargetConfiguration = {
    command: "npx @leancodepl/intl sync",
    options: baseOptions,
  }

  const diffTarget: TargetConfiguration = {
    command: "npx @leancodepl/intl diff",
    options: baseOptions,
  }

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [localTargetName]: localTarget,
          [uploadTargetName]: uploadTarget,
          [downloadTargetName]: downloadTarget,
          [syncTargetName]: syncTarget,
          [diffTargetName]: diffTarget,
        },
      },
    },
  }
}
