import baseConfig from "../../eslint.config.mjs"

const config = [
  ...baseConfig,
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "@nx/dependency-checks": "off",
    },
  },
]

export default config
