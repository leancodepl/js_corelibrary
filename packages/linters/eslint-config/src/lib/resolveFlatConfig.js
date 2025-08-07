function resolveFlatConfig(allModules) {
  let plugins = {}
  let configsWithoutPlugins = []

  allModules.forEach(config => {
    if (config.plugins) {
      plugins = { ...plugins, ...config.plugins }

      const { plugins: _ignoredPlugins, ...configWithoutPlugins } = config
      configsWithoutPlugins = [...configsWithoutPlugins, configWithoutPlugins]
    }
  })

  return [{ plugins }, ...configsWithoutPlugins]
}

module.exports = resolveFlatConfig
