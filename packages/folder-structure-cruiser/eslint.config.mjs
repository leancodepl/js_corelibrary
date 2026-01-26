import baseConfig from "../../eslint.config.mjs"

const config = [
  ...baseConfig,
  {
    rules: {
      "no-console": "off",
    },
  },
]

export default config
