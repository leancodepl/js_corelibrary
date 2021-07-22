/* eslint-env node */

const path = require("path");
const common = require("../common-config");

module.exports = common(__filename, examples => ({
    project: path.resolve(examples, "project/aggregated/Combined/Combined.csproj"),
}));
