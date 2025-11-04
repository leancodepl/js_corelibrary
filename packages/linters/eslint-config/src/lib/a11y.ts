import jsxA11y from "eslint-plugin-jsx-a11y"
import type { TSESLint } from "@typescript-eslint/utils"

export const a11y: TSESLint.FlatConfig.Config[] = [jsxA11y.flatConfigs.recommended]
