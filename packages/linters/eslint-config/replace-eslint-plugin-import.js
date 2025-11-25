// replace require("@leancodepl/eslint-plugin")
// with require("./../../../../eslint-plugin/build")

const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "build/src/lib/base.js")

const config = fs.readFileSync(configPath, "utf8")

fs.writeFileSync(
  configPath,
  config.replace(/require\("@leancodepl\/eslint-plugin"\)/g, 'require("./../../../../eslint-plugin/build")'),
)
