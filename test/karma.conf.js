module.exports = function (config) {
    config.set({

        frameworks: ["mocha", "karma-typescript"],

        files: [
            { pattern: "**/*.ts" }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        singleRun: true,

        reporters: ["dots", "karma-typescript"],

        browsers: ["PhantomJS"],

        phantomjsLauncher: {
            exitOnResourceError: true
        }
    });
};
