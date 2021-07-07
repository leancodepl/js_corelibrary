import concat from "concat-stream";
import { promises } from "fs";
import { join } from "path";
import protobuf from "protobufjs";
import generateContracts from "../src/generateContracts";

const { readFile } = promises;

describe("exampleFiles", () => {
    it("Mindy", async () => {
        let clientOutput: string | undefined = undefined;
        let typesOutput: string | undefined = undefined;

        await generateContracts({
            baseNamespace: "Mindy.Core.Contracts",
            contracts: await readContractsFromFile(join(__dirname, "examples/mindy.pb")),
            clientFiles: [
                {
                    writer: concat(buf => (clientOutput = buf.toString())),
                    eslintExclusions: ["prettier/prettier"],
                },
            ],
            typesFile: {
                writer: concat(buf => (typesOutput = buf.toString())),
                eslintExclusions: ["@typescript-eslint/no-namespace"],
            },
        });

        expect(typesOutput).toMatchSnapshot();
        expect(clientOutput).toMatchSnapshot();
    });

    it("Example", async () => {
        let clientOutput: string | undefined = undefined;
        let typesOutput: string | undefined = undefined;

        await generateContracts({
            baseNamespace: "LeanCode.ContractsGeneratorV2.ExampleContracts",
            contracts: await readContractsFromFile(join(__dirname, "examples/example.pb")),
            clientFiles: [
                {
                    writer: concat(buf => (clientOutput = buf.toString())),
                    eslintExclusions: ["prettier/prettier"],
                },
            ],
            typesFile: {
                writer: concat(buf => (typesOutput = buf.toString())),
                eslintExclusions: ["@typescript-eslint/no-namespace"],
            },
        });

        expect(typesOutput).toMatchSnapshot();
        expect(clientOutput).toMatchSnapshot();
    });
});

async function readContractsFromFile(fileName: string) {
    const file = await readFile(fileName);

    return protobuf.Reader.create(file);
}
