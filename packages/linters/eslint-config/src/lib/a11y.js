const jsxA11y = require("eslint-plugin-jsx-a11y")

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config} Config
 */

/** @type {Config[]} */
const a11y = [jsxA11y.flatConfigs.recommended]

module.exports = { a11y }
