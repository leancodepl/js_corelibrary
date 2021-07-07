import { exec } from "child_process";
import { cosmiconfigSync } from "cosmiconfig";
import { multipleValidOptions, validate } from "jest-validate";
import { join } from "path";
import protobuf from "protobufjs";
import generateContracts from "./generateContracts";
import writeProcessor from "./utils/writeProcessor";

const moduleName = "ts-generator";
const config = cosmiconfigSync(moduleName).search()?.config;

type GenerateFileOptions =
    | {
          eslintExclusions?: string[] | "disable";
          filename?: string;
      }
    | string;

interface GeneratorInput {
    base?: string;
    file?: string;
    path?: string;
    project?: string;
    solution?: string;
}

interface ContractsGeneratorConfiguration {
    input?: GeneratorInput;
    outDir?: string;
    baseNamespace?: string;
    typesFile?: GenerateFileOptions;
    clientFile?: GenerateFileOptions | GenerateFileOptions[];
}

function validateConfig(config: any): config is ContractsGeneratorConfiguration {
    const exampleGenerateFileOptions = multipleValidOptions("Example", {
        eslintExclusions: multipleValidOptions("disable", ["prettier/prettier"]),
        filename: "Example",
    });

    try {
        validate(config, {
            exampleConfig: {
                input: multipleValidOptions(
                    {
                        base: "../../backend/src/Contracts",
                        file: "Input.cs",
                    },
                    {
                        base: "../../backend/src/Contracts",
                        path: "**/*.cs",
                    },
                    {
                        base: "../../backend",
                        project: "src/Contracts/Project.csproj",
                        solution: "Solution.sln",
                    },
                ),
                outDir: "./contracts",
                baseNamespace: "LeanCode.ContractsGenerator.Example",
                typesFile: exampleGenerateFileOptions,
                clientFile: multipleValidOptions(exampleGenerateFileOptions, [exampleGenerateFileOptions]),
            },
        });

        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.toString());

        return false;
    }
}

if (!validateConfig(config)) {
    process.exit(1);
}

console.error(config);

const command = (() => {
    const input = config.input;
    let params = "";

    function withBase(path: string) {
        return input?.base ? join(input.base, path) : path;
    }

    if (input?.file) {
        params += ` --input ${withBase(input.file)}`;
    }

    if (input?.path) {
        params += ` --path ${withBase(input.path)}`;
    }

    if (input?.project) {
        params += ` --project ${withBase(input.project)}`;
    }

    if (input?.solution) {
        params += ` --solution ${withBase(input.solution)}`;
    }

    return "./abc.sh" + params;
})();

exec(
    command,
    {
        encoding: "buffer",
    },
    (error, stdout) => {
        if (error) {
            console.error(error);
            return;
        }

        generateContracts({
            contracts: protobuf.Reader.create(stdout),
            clientFiles: config.clientFile
                ? (Array.isArray(config.clientFile) ? config.clientFile : [config.clientFile]).map(clientFile => {
                      const { filename, eslintExclusions } = processGenerateFileOptions(clientFile);

                      return {
                          eslintExclusions: eslintExclusions,
                          writer: writeProcessor(ensureDefined(filename, "Client file filename must be provided")),
                      };
                  })
                : [],
            typesFile: (() => {
                const { filename, eslintExclusions } = processGenerateFileOptions(config.typesFile);

                return {
                    eslintExclusions: eslintExclusions,
                    writer: writeProcessor(ensureDefined(filename, "Types file filename must be provided")),
                };
            })(),
            baseNamespace: config.baseNamespace,
        });
    },
);

function ensureDefined<T>(value: T | undefined, message?: string) {
    if (value === undefined) {
        throw new Error(message ?? "Value must be defined");
    }

    return value;
}

function processGenerateFileOptions(generateFileOptions?: GenerateFileOptions) {
    if (typeof generateFileOptions === "string") {
        return {
            filename: generateFileOptions,
            eslintExclusions: undefined,
        };
    }
    return (
        generateFileOptions ?? {
            filename: undefined,
            eslintExclusions: undefined,
        }
    );
}
