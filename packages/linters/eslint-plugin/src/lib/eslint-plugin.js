const { switchCaseBracesRules } = require("../rules/switch-case-braces.js")

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Plugin} Plugin
 */

/** @type {Plugin} */
const leancodePlugin = {
  meta: { name: "leancode", version: "0.0.1" },
  rules: { "switch-case-braces": switchCaseBracesRules },
}

module.exports = { leancodePlugin }
