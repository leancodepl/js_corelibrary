const nx = require("@nx/eslint-plugin")
const leancode = require("./packages/linters/eslint-config/src")

module.exports = [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    ...leancode.imports,
    ...leancode.base,
    ...leancode.baseReact,
    ...leancode.a11y,
    {
        ignores: ["**/dist"],
    },
    {
        files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                },
            ],
            "@nx/dependency-checks": "error",
        },
    },
]
