"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const tslib_1 = require("tslib");
const eslint_config_prettier_1 = tslib_1.__importDefault(require("eslint-config-prettier"));
const eslint_plugin_perfectionist_1 = tslib_1.__importDefault(require("eslint-plugin-perfectionist"));
const eslint_plugin_1 = require("./../../../../eslint-plugin/build");
exports.base = [
    {
        plugins: {
            perfectionist: eslint_plugin_perfectionist_1.default,
            "@leancodepl/eslint-plugin": eslint_plugin_1.leancodePlugin,
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
                    groups: ["unknown", "nullish"],
                },
            ],
        },
    },
    eslint_config_prettier_1.default,
];
//# sourceMappingURL=base.js.map