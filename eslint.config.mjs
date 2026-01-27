import nx from "@nx/eslint-plugin"
// eslint-disable-next-line import/no-useless-path-segments
import { a11y, base, baseReact, imports } from "./packages/linters/eslint-config/src/index.js"

const config = [
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

export default config
