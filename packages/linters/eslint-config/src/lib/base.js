const eslintConfigPrettier = require("eslint-config-prettier")
const perfectionist = require("eslint-plugin-perfectionist")
const { leancodePlugin } = require("@leancodepl/eslint-plugin")

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} Config
 */

/** @type {Config[]} */
const base = [
  {
    plugins: {
      perfectionist,
      "@leancodepl/eslint-plugin": leancodePlugin,
    },
    rules: {
      curly: ["error", "multi-line", "consistent"],
      "max-params": ["error", { max: 4 }],
      "no-console": ["warn", { allow: ["warn", "error", "assert"] }],
      "no-eval": "error",
      "no-useless-rename": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-case-declarations": "off",

      "@leancodepl/eslint-plugin/switch-case-braces": "error",

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
        },
      ],
    },
  },
  eslintConfigPrettier,
]

module.exports = { base }
