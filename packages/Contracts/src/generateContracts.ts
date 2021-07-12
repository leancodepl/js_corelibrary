import _ from "lodash";
import { Writable } from "stream";
import ts, { addSyntheticLeadingComment } from "typescript";
import { promisify } from "util";
import { leancode } from "./protocol";
import {
    GeneratorCommand,
    GeneratorContext,
    GeneratorEnum,
    GeneratorInterface,
    GeneratorNamespace,
    GeneratorQuery,
    GeneratorStatement,
    GeneratorTypesDictionary,
} from "./typesGeneration";
import {
    ClientMethodFilter,
    CustomTypesMap,
    OverridableCustomType,
    overridableCustomTypes,
} from "./typesGeneration/GeneratorContext";
import GeneratorInternalType from "./typesGeneration/types/GeneratorInternalType";

const noNamespace = "--no-namespace--";

function extractNamespaces(
    baseNamespace: string,
    statements: leancode.contracts.IStatement[],
    depth = 0,
    typesDictionary: GeneratorTypesDictionary = {
        interfaces: {},
    },
): GeneratorStatement[] {
    return _(statements)
        .groupBy(statement => {
            if (!statement.name) {
                return noNamespace;
            }

            const name = statement.name.startsWith(baseNamespace)
                ? statement.name.substr(baseNamespace.length + 1)
                : statement.name;

            const parts = name.split(".");

            if (parts.length <= depth + 1) {
                return noNamespace;
            }

            return parts[depth];
        })
        .mapValues<GeneratorStatement[]>((statements, name) => {
            if (name === noNamespace) {
                return statements.map(statement => {
                    if (statement.dto || statement.query || statement.command) {
                        let generatorInterface: GeneratorInterface;

                        if (statement.query) {
                            generatorInterface = new GeneratorQuery({ statement, typesDictionary });
                        } else if (statement.command) {
                            generatorInterface = new GeneratorCommand({ statement, typesDictionary });
                        } else {
                            generatorInterface = new GeneratorInterface({ statement, typesDictionary });
                        }

                        typesDictionary.interfaces[generatorInterface.fullName] = generatorInterface;

                        return generatorInterface;
                    }

                    if (statement.enum) {
                        return new GeneratorEnum(statement);
                    }

                    throw new Error("Unkown statement type");
                });
            }

            return [
                new GeneratorNamespace({
                    name,
                    statements: extractNamespaces(baseNamespace, statements, depth + 1, typesDictionary),
                }),
            ];
        })
        .values()
        .flatMap()
        .value();
}

export type GenerateFileOptions = {
    eslintExclusions?: string[] | "disable";
    writer: Writable;
};

export type GenerateTypesFileOptions = GenerateFileOptions & {
    preamble?: ts.Statement[];
};

export type GenerateClientFileOptions = GenerateFileOptions & {
    include?: ClientMethodFilter;
    exclude?: ClientMethodFilter;
    preamble?: (referencedInternalTypes: Set<GeneratorInternalType>) => ts.Statement[];
    cqrsClient?: string;
};

export type OverridableCustomTypeName = keyof {
    [P in keyof typeof leancode.contracts.KnownType as typeof leancode.contracts.KnownType[P] extends OverridableCustomType
        ? P
        : never]: string;
};

export type CustomTypesDefinition = Partial<Record<OverridableCustomTypeName, string>>;

export interface GenerateContractsOptions {
    baseNamespace?: string;
    customTypes?: CustomTypesDefinition;
    typesFile: GenerateTypesFileOptions;
    clientFiles: GenerateClientFileOptions[];
    contracts: protobuf.Reader;
}

export function isOverridableCustomTypeName(name: string): name is OverridableCustomTypeName {
    return overridableCustomTypes.includes(leancode.contracts.KnownType[name as any] as any);
}

export function ensureIsOverridableCustomTypeName(name: string): OverridableCustomTypeName {
    if (!isOverridableCustomTypeName(name)) {
        throw new Error(`${name} is not a valid overridable type`);
    }

    return name;
}

function mapCustomTypes(def: CustomTypesDefinition = {}) {
    return Object.entries(def).reduce((typesMap, [name, typeOverride]) => {
        if (!isOverridableCustomTypeName(name)) {
            return typesMap;
        }

        return {
            ...typesMap,
            [leancode.contracts.KnownType[name]]: () => ts.factory.createTypeReferenceNode(typeOverride),
        };
    }, {} as CustomTypesMap);
}

export default async function generateContracts({
    baseNamespace,
    customTypes,
    clientFiles,
    typesFile,
    contracts,
}: GenerateContractsOptions) {
    const definition = leancode.contracts.Export.decode(contracts);

    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
    });

    const baseContext: Omit<GeneratorContext, "referencedInternalTypes"> = {
        printNode: node =>
            printer.printNode(
                ts.EmitHint.Unspecified,
                node,
                ts.factory.createSourceFile(
                    [],
                    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
                    ts.NodeFlags.Synthesized,
                ),
            ),
    };

    const namespaces = extractNamespaces(baseNamespace ?? noNamespace, definition.statements);
    const types = [
        ...(typesFile.preamble ?? []),
        ...namespaces.flatMap(s =>
            s.generateStatements({
                ...baseContext,
                referencedInternalTypes: new Set(),
                customTypes: mapCustomTypes(customTypes),
                currentNamespace: baseNamespace,
            }),
        ),
    ];

    const eslintExclusions = typesFile.eslintExclusions;

    if (eslintExclusions) {
        if (eslintExclusions === "disable") {
            addSyntheticLeadingComment(types[0], ts.SyntaxKind.MultiLineCommentTrivia, "eslint-disable", true);
        } else {
            addSyntheticLeadingComment(
                types[0],
                ts.SyntaxKind.MultiLineCommentTrivia,
                `eslint-disable ${eslintExclusions.join(" ")}`,
                true,
            );
        }
    }

    const typesOutput = printer.printFile(
        ts.factory.createSourceFile(
            types,
            ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
            ts.NodeFlags.Synthesized,
        ),
    );

    await Promise.all([
        promisify(cb => typesFile.writer.end(typesOutput, cb as any))(),
        ...clientFiles.map(clientFile =>
            generateClient({
                clientFile,
                namespaces,
                baseContext,
                baseNamespace,
                printer,
            }),
        ),
    ]);
}

function generateClient({
    clientFile: { writer, preamble, eslintExclusions, include, exclude },
    namespaces,
    baseContext,
    baseNamespace,
    printer,
}: {
    clientFile: GenerateClientFileOptions;
    namespaces: GeneratorStatement[];
    baseContext: Omit<GeneratorContext, "referencedInternalTypes">;
    baseNamespace: string | undefined;
    printer: ts.Printer;
}) {
    const context: GeneratorContext = {
        ...baseContext,
        referencedInternalTypes: new Set(),
        include,
        exclude,
        currentNamespace: baseNamespace,
    };

    const clientProperties = namespaces.flatMap(s => s.generateClient(context));

    const client = [
        ...(preamble?.(context.referencedInternalTypes) ?? []),
        ts.factory.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [
                ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
                ts.factory.createModifier(ts.SyntaxKind.DefaultKeyword),
            ],
            /* asteriskToken */ undefined,
            /* name */ undefined,
            /* typeParameters */ undefined,
            /* parameters */ [
                ts.factory.createParameterDeclaration(
                    /* decorators */ undefined,
                    /* modifiers */ undefined,
                    /* dotDotDotToken */ undefined,
                    /* name */ ts.factory.createIdentifier("cqrsClient"),
                    /* questionToken */ undefined,
                    /* type */ ts.factory.createTypeReferenceNode("CQRS"),
                    /* initializer */ undefined,
                ),
            ],
            /* type */ undefined,
            /* body */ ts.factory.createBlock(
                /* statements */ [
                    ts.factory.createReturnStatement(
                        /* expression */ ts.factory.createObjectLiteralExpression(
                            /* properties */ ts.factory.createNodeArray(/* elements */ clientProperties),
                            /* multiline */ true,
                        ),
                    ),
                ],
                /* multiline */ true,
            ),
        ),
    ];

    if (eslintExclusions) {
        if (eslintExclusions === "disable") {
            addSyntheticLeadingComment(client[0], ts.SyntaxKind.MultiLineCommentTrivia, "eslint-disable", true);
        } else {
            addSyntheticLeadingComment(
                client[0],
                ts.SyntaxKind.MultiLineCommentTrivia,
                `eslint-disable ${eslintExclusions.join(" ")}`,
                true,
            );
        }
    }

    const clientOutput = printer.printFile(
        ts.factory.createSourceFile(
            client,
            ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
            ts.NodeFlags.Synthesized,
        ),
    );

    return promisify(cb => writer.end(clientOutput, cb as any))();
}
