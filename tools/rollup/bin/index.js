const typescript = require("rollup-plugin-typescript2");
const clear = require("rollup-plugin-clear");
const path = require("path");
const fs = require("fs");
const analyze = require("rollup-plugin-analyzer");
const rollup = require("rollup");

const formats = [
    { format: "umd", target: "es5", name: undefined },
    { format: "esm", target: "esnext", name: "esm" },
];

const packageRootPath = process.cwd();
let inputFile = path.join(packageRootPath, "src/index.tsx");
if (!fs.existsSync(inputFile)) {
    inputFile = path.join(packageRootPath, "src/index.ts");
}
const tsconfigFile = path.join(packageRootPath, "tsconfig.json");
const outputDir = path.join(packageRootPath, "lib");
const packageJsonFile = require(path.join(packageRootPath, "package.json"));

/** @type {[rollup.RollupOptions, rollup.OutputOptions][]} */
const config = formats.map(format => ({
    plugins: [
        typescript({
            tsconfig: tsconfigFile,
            tsconfigOverride: { compilerOptions: { target: format.target } },
        }),
        clear({
            targets: ["lib"],
        }),
        analyze({
            summaryOnly: true,
        }),
    ],
    input: inputFile,
    external: [...Object.keys(packageJsonFile.dependencies || {}), ...Object.keys(packageJsonFile.peerDependencies || {})],
    output: {
        file: path.join(outputDir, `index${format.name ? `.${format.name}` : ""}.js`),
        format: format.format,
        sourcemap: true,
        name: packageJsonFile.name,
        exports: "named",
    }
}));

(async () => {
    for (const options of config) {
        const bundle = await rollup.rollup(options);

        await bundle.write(options.output);
    }
})();
