const { createJiti } = require("jiti")

const jiti = createJiti(__filename)

module.exports = jiti("./index.ts")
