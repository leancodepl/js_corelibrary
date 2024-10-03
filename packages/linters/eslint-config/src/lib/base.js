const perfectionist = require("eslint-plugin-perfectionist")

module.exports = [
    {
        plugins: {
            perfectionist,
        },
        rules: {
            "max-params": ["error", { max: 4 }],
            "no-console": ["warn", { allow: ["warn", "error", "assert"] }],
            "no-eval": "error",
            "no-useless-rename": "error",

            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-explicit-any": "off",

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
]
