import { createNodesFromFiles, CreateNodesV2, TargetConfiguration } from "@nx/devkit"
import { dirname } from "node:path"

const dockerComposeGlob = "**/dev/docker-compose.yml"

export interface ProxyPluginOptions {
  targetName?: string
}

export const createNodesV2: CreateNodesV2<ProxyPluginOptions> = [
  dockerComposeGlob,
  async (configFiles, options, context) =>
    createNodesFromFiles(
      (configFile, options) => createNodesInternal(configFile, options ?? {}),
      configFiles,
      options,
      context,
    ),
]

function createNodesInternal(configFilePath: string, options: ProxyPluginOptions) {
  const dockerComposeDir = dirname(configFilePath)
  const targetName = options.targetName ?? "proxy"

  const proxyTarget: TargetConfiguration = {
    executor: "nx:run-commands",
    defaultConfiguration: "up",
    options: {
      cwd: dockerComposeDir,
    },
    configurations: {
      up: {
        command: "docker compose up proxy",
      },
      rebuild: {
        command:
          "az acr login -n leancode && docker pull leancode.azurecr.io/traefik-proxy && docker compose build --no-cache proxy",
      },
    },
  }

  return {
    projects: {
      "": {
        targets: {
          [targetName]: proxyTarget,
        },
      },
    },
  }
}
