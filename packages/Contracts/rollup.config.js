/* eslint-env node */

const commonjs = require("@rollup/plugin-commonjs");
const download = require("download");
const fs = require("fs");
const path = require("path");
const rollup = require("rollup"); // eslint-disable-line unused-imports/no-unused-vars-ts
const clear = require("rollup-plugin-clear");
const shebang = require("rollup-plugin-preserve-shebang");
const typescript = require("rollup-plugin-typescript2");

const packageRootPath = __dirname;
const inputFile = path.join(packageRootPath, "src/index.ts");
const tsconfigFile = path.join(packageRootPath, "tsconfig.json");
const outputDir = path.join(packageRootPath, "lib");
const packageJsonFile = require(path.join(packageRootPath, "package.json"));

const generateShLocation = "https://raw.githubusercontent.com/leancodepl/contractsgenerator/main/tools/generate.sh";

/** @returns {rollup.Plugin} */
function chmod(mode) {
    return {
        name: "chmod",
        writeBundle(bundle) {
            const filename = String((bundle && (bundle.file || bundle.dest)) || "");
            if (!filename) throw new Error("chmod Rollup plugin.onwrite: filename missing");
            fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755); // rwxr-xr-x
        },
    };
}

/** @returns {rollup.Plugin} */
function getServerScript() {
    let refId;

    return {
        name: "chmod",
        async generateBundle() {
            const generateSh = await download(generateShLocation);

            refId = this.emitFile({
                type: "asset",
                fileName: "generate.sh",
                source: generateSh,
            });
        },
        async writeBundle(options) {
            const filename = path.resolve(path.dirname(options.file), this.getFileName(refId));
            fs.chmodSync(filename, 0o755); // rwxr-xr-x
        },
    };
}

/** @type {rollup.RollupOptions} */
const options = {
    acorn: {
        allowHashBang: true,
    },
    plugins: [
        getServerScript(),
        shebang(),
        chmod(),
        typescript({
            module: "CommonJS",
            tsconfig: tsconfigFile,
            tsconfigOverride: { compilerOptions: { target: "es5" } },
        }),
        commonjs({ extensions: [".js", ".ts"] }),
        clear({
            targets: ["lib"],
        }),
    ],
    input: inputFile,
    treeshake: false,
    external: [
        ...Object.keys(packageJsonFile.dependencies || {}),
        ...Object.keys(packageJsonFile.peerDependencies || {}),
    ],
    output: {
        file: path.join(outputDir, `index.js`),
        format: "commonjs",
        sourcemap: true,
        name: packageJsonFile.name,
        exports: "named",
    },
};

export default options;
