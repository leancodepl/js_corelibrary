import { switchCaseBracesRules } from "../rules/switch-case-braces.js"
import type { TSESLint } from "@typescript-eslint/utils"

export const leancodePlugin: TSESLint.FlatConfig.Plugin = {
  meta: { name: "leancode", version: "0.0.1" },
  rules: { "switch-case-braces": switchCaseBracesRules },
}
