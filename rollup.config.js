import typescript from "rollup-plugin-typescript2";
import path from "path";
import fs from "fs";

const PACKAGE_ROOT_PATH = process.cwd();
let INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.tsx");
if (!fs.existsSync(INPUT_FILE)) {
    INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.ts");
}
const TSCONFIG_FILE = path.join(PACKAGE_ROOT_PATH, "tsconfig.json");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "lib");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const formats = [
    { dist: "umd", ts: "es5" },
    { dist: "es", ts: "esnext" },
];

export default formats.map(format => ({
    plugins: [
        typescript({
            tsconfig: TSCONFIG_FILE,
            tsconfigOverride: { compilerOptions: { target: format.ts } },
        }),
    ],
    input: INPUT_FILE,
    external: [...Object.keys(PKG_JSON.dependencies || {}), ...Object.keys(PKG_JSON.peerDependencies || {})],
    output: {
        file: path.join(OUTPUT_DIR, `index.${format.ts}.js`),
        format: format.dist,
        sourcemap: true,
        name: PKG_JSON.name,
        exports: "named",
    },
}));
