/* eslint-env node */

const path = require("path");

/** @typedef {import("@leancode/contracts/lib/types").ContractsGeneratorConfiguration} Config */

/**
 * @type {(testName: string, input: (examplesDir: string) => Config["input"]) => Config}
 */
module.exports = (testFileName, input) => ({
    typesFile: {
        eslintExclusions: "disable",
        filename: "types.ts",
    },
    clientFile: [
        {
            eslintExclusions: "disable",
            filename: "client.ts",
            cqrsClient: "cqrsClient.ts",
        },
    ],
    baseDir: path.resolve(__dirname, `configs/.tmp_out/${path.parse(testFileName).name.split(".")[0]}`),
    input: input(path.resolve(__dirname, "./examples")),
});
