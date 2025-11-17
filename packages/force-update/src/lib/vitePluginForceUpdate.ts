import type { Plugin } from "vite"

export interface ForceUpdatePluginOptions {
  envVarName?: string
}

/**
 * Vite plugin that emits a version asset file based on an environment variable, 'APP_VERSION' as default
 * This is used for force update mechanism that needs to check the current app version.
 *
 * @param options - Configuration options for the plugin
 * @param options.envVarName - The name of the environment variable to read the version from (default: 'APP_VERSION')
 * @returns A Vite plugin that creates a /version endpoint serving the current app version
 */
export function vitePluginForceUpdate(options: ForceUpdatePluginOptions = {}): Plugin {
  const { envVarName = "APP_VERSION" } = options

  return {
    name: "vite-plugin-force-update",
    generateBundle() {
      const version = process.env[envVarName]

      if (!version) {
        console.warn(`Environment variable ${envVarName} is not set.`)

        return
      }

      this.emitFile({
        type: "asset",
        fileName: "version",
        source: version.trim(),
      })
    },
  }
}
