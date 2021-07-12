import { exec } from "child_process";
import { cosmiconfigSync } from "cosmiconfig";
import { multipleValidOptions, validate } from "jest-validate";
import { posix } from "path";
import protobuf from "protobufjs";
import ts from "typescript";
import generateContracts, { ensureIsOverridableCustomTypeName, OverridableCustomTypeName } from "./generateContracts";
import { leancode } from "./protocol";
import { ClientMethodFilter, overridableCustomTypes } from "./typesGeneration/GeneratorContext";
import GeneratorInternalType from "./typesGeneration/types/GeneratorInternalType";
import extractMinimalReferenceTypeName from "./utils/extractMinimalReferenceTypeName";
import writeProcessor from "./utils/writeProcessor";

const { dirname, extname, join, relative, resolve } = posix;

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
    query: CommonTypesConfiguration;
    command: CommonTypesConfiguration;
    customTypes?: CustomTypesConfiguration;
    typesFile?: GenerateFileConfiguration;
    clientFile?: GenerateClientFileConfiguration | GenerateClientFileConfiguration[];
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
                    getCommonTypePreamble({
                        baseDir,
                        isTypeOnly: true,
                        typeName: "Query",
                        fileLocation: typesFilename,
                        commonTypeConfiguration: ensureDefined(config.query, "Query configuration must be provided"),
                    }),
                    getCommonTypePreamble({
                        baseDir,
                        isTypeOnly: true,
                        typeName: "Command",
                        fileLocation: typesFilename,
                        commonTypeConfiguration: ensureDefined(
                            config.command,
                            "Command configuration must be provided",
                        ),
                    }),
                    ...getCustomTypesPreamble({
                        baseDir,
                        isTypeOnly: true,
                        fileLocation: typesFilename,
                        customTypes: config.customTypes,
                    }),
                ],
                eslintExclusions: typesEslintExclusions,
                writer: writeProcessor(typesFilename),
            }))(),
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

function resolveImport({
    baseDir,
    fileLocation,
    location,
}: {
    baseDir: string;
    fileLocation: string;
    location: string;
}) {
    let relativePath = relative(dirname(fileLocation), resolve(baseDir, location));

    if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
    }

    const ext = extname(relativePath);

    return relativePath.slice(0, -ext.length);
}

function getCustomTypesPreamble({
    baseDir,
    isTypeOnly = false,
    fileLocation,
    customTypes = {},
}: {
    baseDir: string;
    isTypeOnly?: boolean;
    fileLocation: string;
    customTypes?: CustomTypesConfiguration;
}): ts.Statement[] {
    return Object.entries(customTypes).map(([, { location, name, exportName }]) => {
        const importPath = resolveImport({
            location,
            fileLocation,
            baseDir,
        });

        return ts.factory.createImportDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* importClause */ ts.factory.createImportClause(
                /* isTypeOnly */ isTypeOnly,
                /* name */ undefined,
                /* namedBinding */ ts.factory.createNamedImports(
                    /* elements */ [
                        ts.factory.createImportSpecifier(
                            /* propertyName */ exportName ? ts.factory.createIdentifier(exportName) : undefined,
                            /* name */ ts.factory.createIdentifier(name),
                        ),
                    ],
                ),
            ),
            /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
        );
    });
}

function getCommonTypePreamble({
    baseDir,
    fileLocation,
    isTypeOnly = false,
    typeName,
    commonTypeConfiguration,
}: {
    baseDir: string;
    fileLocation: string;
    isTypeOnly?: boolean;
    typeName: string;
    commonTypeConfiguration: CommonTypesConfiguration;
}) {
    const { location, exportName } = (() => {
        if (typeof commonTypeConfiguration === "string") {
            return {
                location: commonTypeConfiguration,
                exportName: undefined,
            };
        }
        return commonTypeConfiguration;
    })();

    const importPath = resolveImport({
        location,
        fileLocation,
        baseDir,
    });

    let importClause;

    if (exportName) {
        importClause = ts.factory.createImportClause(
            /* isTypeOnly */ isTypeOnly,
            /* name */ undefined,
            /* namedBinding */ ts.factory.createNamedImports(
                /* elements */ [
                    ts.factory.createImportSpecifier(
                        /* propertyName */ ts.factory.createIdentifier(exportName),
                        /* name */ ts.factory.createIdentifier(typeName),
                    ),
                ],
            ),
        );
    } else {
        importClause = ts.factory.createImportClause(
            /* isTypeOnly */ isTypeOnly,
            /* name */ ts.factory.createIdentifier(typeName),
            /* namedBinding */ undefined,
        );
    }

    return ts.factory.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined,
        /* importClause */ importClause,
        /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
    );
}

function getReferencedInternalTypesPreamble({
    referencedInternalTypes,
    baseDir,
    fileLocation,
    typesFilename,
    baseNamespace,
}: {
    referencedInternalTypes: Set<GeneratorInternalType>;
    baseDir: string;
    fileLocation: string;
    typesFilename: string;
    baseNamespace?: string;
}) {
    const importPath = resolveImport({
        location: typesFilename,
        fileLocation,
        baseDir,
    });

    const referencedInternalTypesToImport = [
        ...new Set(
            [...referencedInternalTypes.values()].map(
                internalType => extractMinimalReferenceTypeName(internalType.name, baseNamespace).split(".")[0],
            ),
        ).values(),
    ];

    return ts.factory.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined,
        /* importClause */ ts.factory.createImportClause(
            /* isTypeOnly */ false,
            /* name */ undefined,
            /* namedBinding */ ts.factory.createNamedImports(
                /* elements */ referencedInternalTypesToImport.map(typeToImport =>
                    ts.factory.createImportSpecifier(
                        /* propertyName */ undefined,
                        /* name */ ts.factory.createIdentifier(typeToImport),
                    ),
                ),
            ),
        ),
        /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
    );
}
