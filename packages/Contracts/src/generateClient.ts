import ts, { addSyntheticLeadingComment } from "typescript";
import { promisify } from "util";
import { GeneratorContext, GeneratorStatement } from "./typesGeneration";
import { ClientMethodFilter, ImportReference } from "./typesGeneration/GeneratorContext";
import GeneratorInternalType from "./typesGeneration/types/GeneratorInternalType";
import { GenerateFileOptions } from "./utils/types/GenerateFileOptions";

export type GenerateClientFileOptions = GenerateFileOptions & {
    include?: ClientMethodFilter;
    exclude?: ClientMethodFilter;
    preamble?: (options: {
        referencedInternalTypes: Set<GeneratorInternalType>;
        referencedImports: ImportReference[];
    }) => ts.Statement[];
    cqrsClient?: string;
};

export default function generateClient({
    clientFile: { writer, preamble, eslintExclusions, include, exclude },
    namespaces,
    baseContext,
    baseNamespace,
    printer,
}: {
    clientFile: GenerateClientFileOptions;
    namespaces: GeneratorStatement[];
    baseContext: Omit<GeneratorContext, "referencedInternalTypes" | "referencedImports">;
    baseNamespace: string | undefined;
    printer: ts.Printer;
}) {
    const context: GeneratorContext = {
        ...baseContext,
        referencedInternalTypes: new Set(),
        referencedImports: [],
        include,
        exclude,
        currentNamespace: baseNamespace,
    };

    const clientProperties = namespaces.flatMap(s => s.generateClient(context));

    const client = [
        ...(preamble?.({
            referencedInternalTypes: context.referencedInternalTypes,
            referencedImports: context.referencedImports,
        }) ?? []),
        generateClientFunction(clientProperties),
    ];

    if (eslintExclusions) {
        if (eslintExclusions === "disable") {
            addSyntheticLeadingComment(client[0], ts.SyntaxKind.MultiLineCommentTrivia, "eslint-disable", true);
        } else {
            addSyntheticLeadingComment(
                client[0],
                ts.SyntaxKind.MultiLineCommentTrivia,
                `eslint-disable ${eslintExclusions.join(", ")}`,
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

export function generateClientFunction(clientProperties: ts.PropertyAssignment[]) {
    return ts.factory.createFunctionDeclaration(
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
    );
}
