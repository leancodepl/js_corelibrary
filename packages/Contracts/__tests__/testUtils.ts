import ts from "typescript";
import { generateClientFunction } from "../src/generateClient";
import {
    GeneratorContext,
    GeneratorInterface,
    GeneratorStatement,
    GeneratorTypesDictionary,
} from "../src/typesGeneration";
import GeneratorType from "../src/typesGeneration/types/GeneratorType";

export function mkTypesDictionary(interfaces: string[]) {
    const typesDictionary: GeneratorTypesDictionary = {
        statements: {},
    };

    interfaces.forEach(i => {
        typesDictionary.statements[i] = new GeneratorInterface({
            statement: {
                name: i,
            },
            typesDictionary,
        });
    });

    return typesDictionary;
}

export function printStatement(
    generator: GeneratorStatement,
    contextTransform?: (baseContext: GeneratorContext) => GeneratorContext,
) {
    return printFromContext(ctx => generator.generateStatements(ctx), contextTransform);
}

export function printClient(
    generator: GeneratorStatement,
    contextTransform?: (baseContext: GeneratorContext) => GeneratorContext,
) {
    return printFromContext(ctx => [generateClientFunction(generator.generateClient(ctx))], contextTransform);
}

export function printType(
    generator: GeneratorType,
    contextTransform?: (baseContext: GeneratorContext) => GeneratorContext,
) {
    return printFromContext(
        ctx => [
            ts.factory.createVariableStatement(
                /* modifiers */ undefined,
                /* declarationList */ ts.factory.createVariableDeclarationList(
                    /* declarations */ [
                        ts.factory.createVariableDeclaration(
                            /* name */ "variable",
                            /* exclamationToken */ undefined,
                            /* type */ generator.generateType(ctx),
                            /* initializer */ undefined,
                        ),
                    ],
                    /* flags */ undefined,
                ),
            ),
        ],
        contextTransform,
    );
}

export function getBaseContext(printer: ts.Printer): GeneratorContext {
    return {
        referencedInternalTypes: new Set(),
        referencedImports: [],
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
}

export function createPrinter() {
    return ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
    });
}

export function printRawStatements(statements: ts.Statement[], printer: ts.Printer) {
    return printer.printFile(
        ts.factory.createSourceFile(
            statements,
            ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
            ts.NodeFlags.Synthesized,
        ),
    );
}

export function printFromContext(
    statements: (context: GeneratorContext) => ts.Statement[],
    contextTransform: (baseContext: GeneratorContext) => GeneratorContext = ctx => ctx,
) {
    const printer = createPrinter();

    const context = contextTransform(getBaseContext(printer));

    return printRawStatements(statements(context), printer);
}
