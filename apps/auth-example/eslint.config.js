const baseConfig = require("../../eslint.config.js")
const leancode = require("../../packages/linters/eslint-config/src")

module.exports = [...baseConfig, ...leancode.baseReact]
