const switchCaseBraces = require("./rules/switch-case-braces")

// eslint-disable-next-line import/first, perfectionist/sort-imports
import type { TSESLint } from "@typescript-eslint/utils"

const leancodePlugin: TSESLint.FlatConfig.Plugin = {
  meta: { name: "leancode" },
  rules: { "switch-case-braces": switchCaseBraces },
}

module.exports = leancodePlugin

export {}
