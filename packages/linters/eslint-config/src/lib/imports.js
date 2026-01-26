const importsPlugin = require("eslint-plugin-import")
const unusedImports = require("eslint-plugin-unused-imports")

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} Config
 */

/** @type {Config[]} */
const imports = [
  {
    plugins: {
      "unused-imports": unusedImports,
      import: importsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-anonymous-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      "import/no-named-default": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "client-server-only",
            "react",
            ["builtin", "external"],
            ["type-internal", "internal"],
            ["parent", "sibling", "index"],
            ["type", "type-parent", "type-sibling", "type-index"],
            "side-effect",
            "style",
            "unknown",
          ],
          customGroups: [
            {
              selector: "type",
              groupName: "react",
              elementNamePattern: "^react$",
            },
            {
              groupName: "react",
              elementNamePattern: ["^react$", "^react-.+"],
            },
            {
              groupName: "client-server-only",
              elementNamePattern: ["^client-only$", "^server-only$"],
            },
          ],
          newlinesBetween: 0,
          internalPattern: ["^@leancodepl/.+"],
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]

module.exports = { imports }
