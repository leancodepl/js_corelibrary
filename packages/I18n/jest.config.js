/* eslint-env node */

const baseConfig = require("../../jest.config.base");

module.exports = {
    ...baseConfig(__dirname),
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
        url: "http://test.lncd.pl",
    },
};
