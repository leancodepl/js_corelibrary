import eslintConfigPrettier from "eslint-config-prettier"
import perfectionist from "eslint-plugin-perfectionist"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import globals from "globals"
import tseslint from "typescript-eslint"
import { leancodePlugin } from "@leancodepl/eslint-plugin"

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} Config
 */

/** @type {Config[]} */
export const base = [
  {
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      perfectionist,
      leancode: leancodePlugin,
    },
    rules: {
      curly: ["error", "multi-line", "consistent"],
      "max-params": ["error", { max: 4 }],
      "no-console": ["warn", { allow: ["warn", "error", "assert"] }],
      "no-eval": "error",
      "no-useless-rename": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-case-declarations": "off",

      "leancode/switch-case-braces": "error",

      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
      "perfectionist/sort-array-includes": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-intersection-types": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: ["unknown", "nullish"],
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unicorn/better-regex": "error",
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-destructuring": "error",
      "unicorn/consistent-existence-index-check": "error",
      "unicorn/custom-error-definition": "error",
      "unicorn/error-message": "error",
      "unicorn/expiring-todo-comments": "error",
      "unicorn/no-array-method-this-argument": "error",
      "unicorn/no-array-reverse": "error",
      "unicorn/no-array-sort": "error",
      "unicorn/no-await-expression-member": "error",
      "unicorn/no-await-in-promise-methods": "error",
      "unicorn/no-document-cookie": "error",
      "unicorn/no-immediate-mutation": "error",
      "unicorn/no-instanceof-builtins": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-magic-array-flat-depth": "error",
      "unicorn/no-negation-in-equality-check": "error",
      "unicorn/no-nested-ternary": "error",
      "unicorn/no-new-buffer": "error",
      "unicorn/no-single-promise-in-promise-methods": "error",
      "unicorn/no-static-only-class": "error",
      "unicorn/no-unnecessary-array-flat-depth": "error",
      "unicorn/no-useless-collection-argument": "error",
      "unicorn/no-useless-fallback-in-spread": "error",
      "unicorn/no-useless-promise-resolve-reject": "error",
      "unicorn/no-useless-switch-case": "error",
      "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
      "unicorn/no-zero-fractions": "error",
      "unicorn/numeric-separators-style": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-index-of": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-at": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-export-from": "error",
      "unicorn/prefer-global-this": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-math-min-max": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-object-from-entries": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-set-size": "error",
      "unicorn/prefer-single-call": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-raw": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-structured-clone": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/prefer-type-error": "error",
      "unicorn/require-array-join-separator": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      "unicorn/template-indent": "error",
      "unicorn/throw-new-error": "error",
    },
  },
  eslintConfigPrettier,
]
