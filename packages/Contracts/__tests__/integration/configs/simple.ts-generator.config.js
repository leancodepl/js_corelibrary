/* eslint-env node */

const common = require("../common-config");

module.exports = common(__filename, examples => ({
    base: examples,
    include: "simple/*.cs",
}));
