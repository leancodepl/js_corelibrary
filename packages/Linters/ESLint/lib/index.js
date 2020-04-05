module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "prettier/@typescript-eslint",
        "prettier/react",
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        "no-var": "off",
        "no-console": ["warn", { allow: ["warn", "error", "assert"] }],
        "max-params": ["error", { max: 4 }],

        "prettier/prettier": "warn",

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/prefer-interface": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-inferrable-types": "off",

        "react/prop-types": "off",
        "react/display-name": "off",
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
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    env: {
        browser: true,
    },
    overrides: [
        {
            files: ["*.scss.d.ts", "*.less.d.ts"],
            rules: {
                "prettier/prettier": 0,
            },
        },
    ],
};
