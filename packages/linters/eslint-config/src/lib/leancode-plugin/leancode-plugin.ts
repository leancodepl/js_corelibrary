import { switchCaseBracesRules } from "./rules/switch-case-braces.js"
import type { TSESLint } from "@typescript-eslint/utils"

export const leancodePlugin: TSESLint.FlatConfig.Plugin = {
  meta: { name: "leancode" },
  rules: { "switch-case-braces": switchCaseBracesRules },
}
