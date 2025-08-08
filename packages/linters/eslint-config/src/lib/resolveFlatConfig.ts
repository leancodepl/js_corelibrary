/**
 * Resolves ESLint flat config by merging plugins and separating configurations.
 *
 * Combines plugins from multiple ESLint configurations into a single plugins object,
 * then returns an array with the merged plugins followed by the individual configs
 * without their plugins.
 *
 * @param allModules - Array of ESLint flat config objects to merge
 * @returns Array containing merged plugins object followed by individual configs
 * @example
 * ```javascript
 * const configs = [
 *   { plugins: { react: reactPlugin }, rules: { "react/jsx-uses-react": "error" } },
 *   { plugins: { typescript: tsPlugin }, rules: { "@typescript-eslint/no-unused-vars": "error" } }
 * ]
 *
 * const resolved = resolveFlatConfig(configs)
 * // Returns: [
 * //   { plugins: { react: reactPlugin, typescript: tsPlugin } },
 * //   { rules: { "react/jsx-uses-react": "error" } },
 * //   { rules: { "@typescript-eslint/no-unused-vars": "error" } }
 * // ]
 * ```
 */

import { Linter } from "eslint"

// Resolves flat config issue: https://github.com/eslint/eslintrc/issues/135
function resolveFlatConfig(allModules: Linter.Config[]): Linter.Config[] {
  let plugins = {}
  let configsWithoutPlugins: Linter.Config[] = []

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
