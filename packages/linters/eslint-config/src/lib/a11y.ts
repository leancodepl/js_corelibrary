const jsxA11y = require("eslint-plugin-jsx-a11y")

// eslint-disable-next-line import/first, perfectionist/sort-imports
import type { TSESLint } from "@typescript-eslint/utils"

const a11yConfig: TSESLint.FlatConfig.Config[] = [jsxA11y.flatConfigs.recommended]

module.exports = a11yConfig

export {}
