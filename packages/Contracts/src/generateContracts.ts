import _ from "lodash";
import ts, { addSyntheticLeadingComment } from "typescript";
import { promisify } from "util";
import generateClient, { GenerateClientFileOptions } from "./generateClient";
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
    CustomTypesMap,
    ImportReference,
    OverridableCustomType,
    overridableCustomTypes,
} from "./typesGeneration/GeneratorContext";
import pipe from "./utils/pipe";
import { GenerateFileOptions } from "./utils/types/GenerateFileOptions";

const noNamespace = "--no-namespace--";

function extractNamespaces(statements: GeneratorStatement[], depth = 0): GeneratorStatement[] {
    return _(statements)
        .groupBy(statement => {
            if (!statement.fullName) {
                return noNamespace;
            }

            const parts = statement.fullName.split(".");

            if (parts.length <= depth + 1) {
                return noNamespace;
            }

            return parts[depth];
        })
        .mapValues<GeneratorStatement[]>((statements, name) => {
            if (name === noNamespace) {
                return statements;
            }

            return [
                new GeneratorNamespace({
                    name,
                    statements: extractNamespaces(statements, depth + 1),
                }),
            ];
        })
        .values()
        .flatMap()
        .value();
}

export type GenerateTypesFileOptions = GenerateFileOptions & {
    preamble?: (options: { referencedImports: ImportReference[] }) => ts.Statement[];
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
    nameTransform?: (name: string) => string;
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
    nameTransform,
}: GenerateContractsOptions) {
    const definition = leancode.contracts.Export.decode(contracts);

    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
    });

    const baseContext: Omit<GeneratorContext, "referencedInternalTypes" | "referencedImports"> = {
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

    const typesDictionary: GeneratorTypesDictionary = {
        statements: {},
    };

    const emptyTransform = (name: string) => name;

    const composedNameTransform = pipe(
        nameTransform ?? emptyTransform,
        baseNamespace
            ? name => (name.startsWith(baseNamespace) ? name.substr(baseNamespace.length) : name)
            : emptyTransform,
        name => (name.startsWith(".") ? name.substr(1) : name),
    );

    const statements: GeneratorStatement[] = definition.statements.map(statement => {
        if (statement.dto || statement.query || statement.command) {
            let generatorInterface: GeneratorInterface;

            if (statement.query) {
                generatorInterface = new GeneratorQuery({
                    statement,
                    typesDictionary,
                    nameTransform: composedNameTransform,
                });
            } else if (statement.command) {
                generatorInterface = new GeneratorCommand({
                    statement,
                    typesDictionary,
                    nameTransform: composedNameTransform,
                });
            } else {
                generatorInterface = new GeneratorInterface({
                    statement,
                    typesDictionary,
                    nameTransform: composedNameTransform,
                });
            }

            typesDictionary.statements[generatorInterface.id] = generatorInterface;

            return generatorInterface;
        }

        if (statement.enum) {
            const generatorEnum = new GeneratorEnum({ statement, nameTransform: composedNameTransform });

            typesDictionary.statements[generatorEnum.id] = generatorEnum;

            return generatorEnum;
        }

        throw new Error("Unkown statement type");
    });

    const referencedImports: ImportReference[] = [];

    const namespaces = extractNamespaces(statements);
    const types = namespaces.flatMap(s =>
        s.generateStatements({
            ...baseContext,
            referencedImports,
            referencedInternalTypes: new Set(),
            customTypes: mapCustomTypes(customTypes),
        }),
    );

    if (typesFile.preamble) {
        types.unshift(...typesFile.preamble({ referencedImports }));
    }

    const eslintExclusions = typesFile.eslintExclusions;

    if (eslintExclusions) {
        if (eslintExclusions === "disable") {
            addSyntheticLeadingComment(types[0], ts.SyntaxKind.MultiLineCommentTrivia, "eslint-disable", true);
        } else {
            addSyntheticLeadingComment(
                types[0],
                ts.SyntaxKind.MultiLineCommentTrivia,
                `eslint-disable ${eslintExclusions.join(", ")}`,
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
