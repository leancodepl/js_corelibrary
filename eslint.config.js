const nx = require("@nx/eslint-plugin")
const { a11y, base, baseReact, imports } = require("./packages/linters/eslint-config/build/src")

module.exports = [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  ...base,
  ...imports,
  ...baseReact,
  ...a11y,
  {
    ignores: ["**/dist", "**/vite.config.*.timestamp*", "**/vitest.config.*.timestamp*"],
  },
  {
    files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
      "@nx/dependency-checks": "error",
    },
  },
]
