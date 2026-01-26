import baseConfig from "../../eslint.config.mjs"

const config = [
  ...baseConfig,
  {
    ignores: ["**/api.generated/**"],
  },
]

export default config
