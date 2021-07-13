/* eslint-env node */
module.exports = {
    extends: ["plugin:import/typescript"],

    plugins: ["import", "unused-imports"],

    rules: {
        "@typescript-eslint/no-unused-vars": "off",

        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-anonymous-default-export": "error",
        "import/no-duplicates": "error",
        "import/no-extraneous-dependencies": "error",
        "import/no-named-as-default": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-useless-path-segments": [
            "error",
            {
                noUselessIndex: true,
            },
        ],
        "import/order": [
            "error",
            {
                groups: [["builtin", "external"], "internal", ["index", "sibling", "parent"], "object"],
                pathGroups: [
                    {
                        pattern: "react",
                        group: "external",
                        position: "before",
                    },
                ],
                "newlines-between": "never",
                alphabetize: { order: "asc", caseInsensitive: true },
            },
        ],
        "import/prefer-default-export": "error",

        "react/jsx-uses-react": "off",
        "react/jsx-uses-vars": "error",

        "unused-imports/no-unused-imports-ts": "error",
        "unused-imports/no-unused-vars-ts": [
            "error",
            { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
        ],
    },
    settings: {
        "import/internal-regex": "^react$",
    },
};
