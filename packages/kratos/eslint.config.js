const baseConfig = require("../../eslint.config.js")
const leancode = require("../linters/eslint-config/src/index.js")

module.exports = [...baseConfig, ...leancode.baseReact]
