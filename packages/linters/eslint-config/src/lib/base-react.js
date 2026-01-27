import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} Config
 */

/** @type {Config[]} */
export const baseReact = [
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "warn",
      "react/jsx-fragments": "warn",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react/self-closing-comp": "error",

      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",

      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
    },
  },
]
