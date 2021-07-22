import { execSync } from "child_process";
import { promises, readdirSync } from "fs";
import path from "path";

const { readFile, rm, readdir } = promises;

const configsDir = path.resolve(__dirname, "./configs");
const tmpOutDir = path.resolve(configsDir, "./.tmp_out");

describe("integration", () => {
    afterEach(async () => {
        await rm(tmpOutDir, {
            recursive: true,
        });
    });

    it.each(readdirSync(configsDir).map(testFile => [testFile.split(".")[0]]))(
        "works for example %s correctly",
        async (testName: string) => {
            runConfig(testName);

            expect(await getTestOutput(testName)).toMatchSnapshot();
        },
    );
});

function getConfigLocation(testName: string) {
    return path.resolve(configsDir, `${testName}.ts-generator.config.js`);
}

function runConfig(testName: string) {
    execSync(`node "${path.resolve(__dirname, "../../lib/index.js")}" -c ${getConfigLocation(testName)}`);
}

async function getTestOutput(testName: string) {
    const outDir = path.resolve(tmpOutDir, testName);

    const files = await readdir(outDir);

    return Object.fromEntries(
        await Promise.all(
            files.map(file => readFile(path.resolve(outDir, file)).then(result => [file, result.toString()] as const)),
        ),
    );
}
