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

type GenerateFileOptions = {
    eslintExclusions?: string[] | "disable";
    writer: Writable;
};

interface GenerateContractsOptions {
    baseNamespace?: string;
    typesFile: GenerateFileOptions;
    clientFiles: GenerateFileOptions[];
    contracts: protobuf.Reader;
}

export default async function generateContracts({
    contracts,
    baseNamespace,
    clientFiles,
    typesFile,
}: GenerateContractsOptions) {
    const definition = leancode.contracts.Export.decode(contracts);

    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
    });

    const baseContext: GeneratorContext = {
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
    const types = namespaces.flatMap(s =>
        s.generateStatements({
            ...baseContext,
            currentNamespace: baseNamespace,
        }),
    );

    const client = ts.factory.createFunctionDeclaration(
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
                        /* properties */ ts.factory.createNodeArray(
                            /* elements */ namespaces.flatMap(s =>
                                s.generateClient({
                                    ...baseContext,
                                    currentNamespace: baseNamespace,
                                }),
                            ),
                        ),
                        /* multiline */ true,
                    ),
                ),
            ],
            /* multiline */ true,
        ),
    );

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
        ...clientFiles.map(clientFile => {
            const eslintExclusions = clientFile.eslintExclusions;
            const clientCopy: typeof client = { ...client };

            if (eslintExclusions) {
                if (eslintExclusions === "disable") {
                    addSyntheticLeadingComment(
                        clientCopy,
                        ts.SyntaxKind.MultiLineCommentTrivia,
                        "eslint-disable",
                        true,
                    );
                } else {
                    addSyntheticLeadingComment(
                        clientCopy,
                        ts.SyntaxKind.MultiLineCommentTrivia,
                        `eslint-disable ${eslintExclusions.join(" ")}`,
                        true,
                    );
                }
            }

            const clientOutput = printer.printFile(
                ts.factory.createSourceFile(
                    [clientCopy],
                    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
                    ts.NodeFlags.Synthesized,
                ),
            );

            return promisify(cb => clientFile.writer.end(clientOutput, cb as any))();
        }),
    ]);
}
