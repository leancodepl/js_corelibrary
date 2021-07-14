#!/usr/bin/env node

import { exec } from "child_process";
import { cosmiconfigSync } from "cosmiconfig";
import { multipleValidOptions, validate } from "jest-validate";
import { posix } from "path";
import protobuf from "protobufjs";
import generateContracts, { ensureIsOverridableCustomTypeName, OverridableCustomTypeName } from "./generateContracts";
import getCommandTypePreamble from "./preambles/getCommandTypePreamble";
import getCommonTypePreamble from "./preambles/getCommonTypePreamble";
import getCustomTypesPreamble from "./preambles/getCustomTypesPreamble";
import getQueryTypePreamble from "./preambles/getQueryTypePreamble";
import getReferencedInternalTypesPreamble from "./preambles/getReferencedInternalTypesPreamble";
import { leancode } from "./protocol";
import { ClientMethodFilter, overridableCustomTypes } from "./typesGeneration/GeneratorContext";
import ensureDefined from "./utils/ensureDefined";
import writeProcessor from "./utils/writeProcessor";

const { join, resolve } = posix;

const serverContractsGeneratorVersion = "1.0.2";
const moduleName = "ts-generator";
const config = cosmiconfigSync(moduleName).search()?.config;

if (!config) {
    console.error(`Couldn't find any ${moduleName} config file.`);
    process.exit(1);
}

export type GenerateFileConfiguration =
    | {
          eslintExclusions?: string[] | "disable";
          filename?: string;
      }
    | string;

export interface GeneratorInput {
    base?: string;
    file?: string;
    path?: string;
    project?: string;
    solution?: string;
}

export type CustomTypeConfiguration = {
    name: string;
    location: string;
    exportName?: string;
};

export type CommonTypesConfiguration =
    | {
          location: string;
          exportName?: string;
      }
    | string;

export type GenerateClientFileConfiguration = {
    filename: string;
    cqrsClient: CommonTypesConfiguration;
    eslintExclusions?: string[] | "disable";
    include?: ClientMethodFilterConfiguration;
    exclude?: ClientMethodFilterConfiguration;
};

export type ClientMethodFilterConfiguration = string | string[] | ClientMethodFilter;

export type CustomTypesConfiguration = Partial<Record<OverridableCustomTypeName, CustomTypeConfiguration>>;

export interface ContractsGeneratorConfiguration {
    input?: GeneratorInput;
    baseDir?: string;
    baseNamespace?: string;
    query?: CommonTypesConfiguration;
    command?: CommonTypesConfiguration;
    customTypes?: CustomTypesConfiguration;
    typesFile?: GenerateFileConfiguration;
    clientFile?: GenerateClientFileConfiguration | GenerateClientFileConfiguration[];
    overrideGeneratorServerVersion?: string;
    overrideGeneratorServerScript?: string;
}

function validateConfig(config: any): config is ContractsGeneratorConfiguration {
    const exampleGenerateFileOptions = multipleValidOptions("Example", {
        eslintExclusions: multipleValidOptions("disable", ["prettier/prettier"]),
        filename: "Example",
    });

    const exampleClientMethodFilterConfiguration = multipleValidOptions(
        "LeanCode.Example",
        ["LeanCode.Example.Users", "LeanCode.Example.Admin"],
        () => {},
    );

    const exampleCustomTypeDefinition = {
        name: "ApiTime",
        location: "../utils/time.ts",
        exportName: "apiTime",
    };

    const exampleCommonTypeDefinition = multipleValidOptions("../client/CQRS.ts", {
        location: "../client/CQRS.ts",
        exportName: "rxCqrs",
    });

    const exampleGenerateClientFileOptions = {
        eslintExclusions: multipleValidOptions("disable", ["prettier/prettier"]),
        filename: "Example",
        include: exampleClientMethodFilterConfiguration,
        exclude: exampleClientMethodFilterConfiguration,
        cqrsClient: exampleCommonTypeDefinition,
    };

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
                customTypes: Object.fromEntries(
                    Object.entries(leancode.contracts.KnownType)
                        .filter(([, value]) => overridableCustomTypes.includes(value as any))
                        .map(([name]) => [name, exampleCustomTypeDefinition]),
                ),
                query: exampleCommonTypeDefinition,
                command: exampleCommonTypeDefinition,
                baseDir: "./contracts",
                baseNamespace: "LeanCode.ContractsGenerator.Example",
                typesFile: exampleGenerateFileOptions,
                clientFile: multipleValidOptions(exampleGenerateClientFileOptions, [exampleGenerateClientFileOptions]),
                overrideGeneratorServerVersion: "1.0.2",
                overrideGeneratorServerScript: "my-custom-generator.sh",
            },
        });

        return true;
    } catch (e) {
        console.error(e.toString());

        return false;
    }
}

if (!validateConfig(config)) {
    process.exit(1);
}

const command = (() => {
    const input = config.input;
    let params = "";

    function withBase(path: string) {
        return input?.base ? join(input.base, path) : path;
    }

    if (input?.project) {
        params = `project --project="${withBase(input.project)}"`;

        if (input?.solution) {
            params += ` --solution="${withBase(input.solution)}"`;
        }
    } else if (input?.file) {
        params = `file --input="${withBase(input.file)}"`;
    } else if (input?.path) {
        params = `path --path="${withBase(input.path)}"`;
    }

    params += ` --output=-`;

    const serverVersion = `SERVER_VERSION=${config.overrideGeneratorServerVersion ?? serverContractsGeneratorVersion}`;
    const script = config.overrideGeneratorServerScript ?? resolve(__dirname, "generate.sh");

    return `${serverVersion} "${script}" ${params}`;
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

        const baseDir = resolve(config.baseDir ?? "");

        const { filename: _typesFilename, eslintExclusions: typesEslintExclusions } = processGenerateFileOptions(
            baseDir,
            config.typesFile,
        );
        const typesFilename = ensureDefined(_typesFilename, "Types file filename must be provided");

        generateContracts({
            contracts: protobuf.Reader.create(stdout),
            clientFiles: config.clientFile
                ? (Array.isArray(config.clientFile) ? config.clientFile : [config.clientFile]).map(clientFile => {
                      const {
                          filename: _filename,
                          eslintExclusions,
                          include,
                          exclude,
                          cqrsClient,
                      } = processGenerateClientFileOptions(baseDir, clientFile);

                      const filename = ensureDefined(_filename, "Client file filename must be provided");

                      return {
                          preamble: referencedInternalTypes => [
                              getCommonTypePreamble({
                                  baseDir,
                                  typeName: "CQRS",
                                  fileLocation: filename,
                                  commonTypeConfiguration: ensureDefined(
                                      cqrsClient,
                                      "Cqrs Client configuration must be provided",
                                  ),
                              }),
                              ...getCustomTypesPreamble({
                                  baseDir,
                                  fileLocation: filename,
                                  customTypes: config.customTypes,
                              }),
                              getReferencedInternalTypesPreamble({
                                  baseDir,
                                  fileLocation: filename,
                                  typesFilename,
                                  referencedInternalTypes,
                                  baseNamespace: config.baseNamespace,
                              }),
                          ],
                          writer: writeProcessor(filename),
                          eslintExclusions,
                          include,
                          exclude,
                      };
                  })
                : [],
            customTypes: Object.fromEntries(
                Object.entries(config.customTypes ?? {}).map(([name, customType]) => [
                    ensureIsOverridableCustomTypeName(name),
                    customType.name,
                ]),
            ),
            typesFile: (() => ({
                preamble: [
                    ...getCustomTypesPreamble({
                        baseDir,
                        isTypeOnly: true,
                        fileLocation: typesFilename,
                        customTypes: config.customTypes,
                    }),
                    config.query
                        ? getCommonTypePreamble({
                              baseDir,
                              isTypeOnly: true,
                              typeName: "Query",
                              fileLocation: typesFilename,
                              commonTypeConfiguration: config.query,
                          })
                        : getQueryTypePreamble(),
                    config.command
                        ? getCommonTypePreamble({
                              baseDir,
                              isTypeOnly: true,
                              typeName: "Command",
                              fileLocation: typesFilename,
                              commonTypeConfiguration: config.command,
                          })
                        : getCommandTypePreamble(),
                ],
                eslintExclusions: typesEslintExclusions,
                writer: writeProcessor(typesFilename),
            }))(),
            baseNamespace: config.baseNamespace,
        });
    },
);

function processGenerateFileOptions(baseDir: string, generateFileOptions?: GenerateFileConfiguration) {
    if (typeof generateFileOptions === "string") {
        return {
            filename: resolve(baseDir, generateFileOptions),
            eslintExclusions: undefined,
        };
    }

    return {
        filename: generateFileOptions?.filename ? resolve(baseDir, generateFileOptions.filename) : undefined,
        eslintExclusions: generateFileOptions?.eslintExclusions,
    };
}

function processGenerateClientFileOptions(baseDir: string, generateClientFileOptions: GenerateClientFileConfiguration) {
    function processClientMethodFilterConfiguration(
        filterConfiguration?: ClientMethodFilterConfiguration,
    ): ClientMethodFilter | undefined {
        let stringFilters: string[];

        if (typeof filterConfiguration === "string") {
            stringFilters = [filterConfiguration];
        } else if (Array.isArray(filterConfiguration)) {
            stringFilters = filterConfiguration;
        } else {
            return filterConfiguration;
        }

        return name => stringFilters.some(f => name.startsWith(f));
    }

    const baseGenerateFileOptions = processGenerateFileOptions(baseDir, generateClientFileOptions);

    return {
        ...baseGenerateFileOptions,
        include: processClientMethodFilterConfiguration(generateClientFileOptions.include),
        exclude: processClientMethodFilterConfiguration(generateClientFileOptions.exclude),
        cqrsClient: generateClientFileOptions.cqrsClient,
    };
}
