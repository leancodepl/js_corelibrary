import { cruise, ICruiseOptions, IResolveOptions } from "dependency-cruiser"
import extractDepcruiseOptions from "dependency-cruiser/config-utl/extract-depcruise-options"
import extractTSConfig from "dependency-cruiser/config-utl/extract-ts-config"
import extractWebpackResolveConfig from "dependency-cruiser/config-utl/extract-webpack-resolve-config"

export type CruiseParams = {
  directories: string[]
  configPath: string
  tsConfigPath?: string
  webpackConfigPath?: string
}

export async function getCruiseResult({
  directories = [".*"],
  configPath,
  tsConfigPath,
  webpackConfigPath,
}: CruiseParams) {
  const depcruiseOptions: ICruiseOptions = await extractDepcruiseOptions(configPath)
  const webpackConfig = webpackConfigPath ? await extractWebpackResolveConfig(webpackConfigPath) : undefined
  const tsConfig = tsConfigPath ? extractTSConfig(tsConfigPath) : undefined

  const cruiseResult = await cruise(directories, { ...depcruiseOptions }, webpackConfig as IResolveOptions, {
    tsConfig,
  })

  return cruiseResult
}
