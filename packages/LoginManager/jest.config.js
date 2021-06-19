/* eslint-env node */

const baseConfig = require("../../jest.config.base");

module.exports = {
    ...baseConfig(__dirname),
    testEnvironment: "jsdom",
};
