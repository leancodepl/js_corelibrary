"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseReact = void 0;
const tslib_1 = require("tslib");
const eslint_plugin_react_1 = tslib_1.__importDefault(require("eslint-plugin-react"));
const eslint_plugin_react_hooks_1 = tslib_1.__importDefault(require("eslint-plugin-react-hooks"));
const globals_1 = tslib_1.__importDefault(require("globals"));
exports.baseReact = [
    {
        plugins: {
            react: eslint_plugin_react_1.default,
            "react-hooks": eslint_plugin_react_hooks_1.default,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals_1.default.browser,
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
        },
    },
];
//# sourceMappingURL=base-react.js.map