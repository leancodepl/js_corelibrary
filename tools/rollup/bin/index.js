#!/usr/bin/env node

/* eslint-env node */

const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const clear = require("rollup-plugin-clear");
const typescript = require("rollup-plugin-typescript2");

/** @type {{ format: rollup.InternalModuleFormat, target: string, name: string | undefined  }[]} */
const formats = [
    { format: "umd", target: "es5", name: undefined },
    { format: "es", target: "es2019", name: "esm" },
];

const packageRootPath = process.cwd();
let inputFile = path.join(packageRootPath, "src/index.tsx");
if (!fs.existsSync(inputFile)) {
    inputFile = path.join(packageRootPath, "src/index.ts");
}
const tsconfigFile = path.join(packageRootPath, "tsconfig.json");
const outputDir = path.join(packageRootPath, "lib");
const packageJsonFile = require(path.join(packageRootPath, "package.json"));

/** @type {rollup.RollupOptions[]} */
const config = formats.map(format => ({
    plugins: [
        typescript({
            tsconfig: tsconfigFile,
            tsconfigOverride: { compilerOptions: { target: format.target } },
        }),
        clear({
            targets: ["lib"],
        }),
    ],
    input: inputFile,
    external: [
        ...Object.keys(packageJsonFile.dependencies || {}),
        ...Object.keys(packageJsonFile.peerDependencies || {}),
    ],
    output: {
        file: path.join(outputDir, `index${format.name ? `.${format.name}` : ""}.js`),
        format: format.format,
        sourcemap: true,
        name: packageJsonFile.name,
        exports: "named",
    },
}));

(async () => {
    for (const options of config) {
        try {
            const bundle = await rollup.rollup(options);

            /** @type {rollup.OutputOptions[]} */
            let outputOptions = [];

            if (options.output) {
                if (Array.isArray(options.output)) {
                    outputOptions = options.output;
                } else {
                    outputOptions = [options.output];
                }
            }

            for (const outputOption of outputOptions) {
                await bundle.write(outputOption);
            }
        } catch (e) {
            console.log(e); // eslint-disable-line no-console
        }
    }
})();
