import ts from "typescript";
import { GeneratorInterface } from ".";
import { leancode } from "../protocol";
import { assertNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import GeneratorErrorCodes from "./GeneratorErrorCodes";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";

export default class GeneratorCommand extends GeneratorInterface {
    errorCodes;

    constructor({
        statement,
        typesDictionary,
    }: {
        statement: leancode.contracts.IStatement;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        super({ statement, typesDictionary });

        assertNotEmpty(statement.command);

        const errorCodes = new GeneratorErrorCodes({ errorCodes: statement.command.errorCodes ?? [] });

        this.errorCodes = errorCodes;
    }

    generateStatements(context: GeneratorContext): ts.Statement[] {
        const interfaceStatements = super.generateStatements(context);

        const generatedErrorCodes = this.errorCodes.generateErrorCodes();

        if (generatedErrorCodes) {
            const namespaceStatement = ts.factory.createModuleDeclaration(
                /* decorators */ undefined,
                /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                /* name */ ts.factory.createIdentifier(this.name),
                /* body */ ts.factory.createModuleBlock(generatedErrorCodes),
                /* flags */ ts.NodeFlags.Namespace,
            );

            return [...interfaceStatements, namespaceStatement];
        }

        return interfaceStatements;
    }

    generateClient(context: GeneratorContext): ts.PropertyAssignment[] {
        if (!(context.include?.(this.fullName, this) ?? true) || (context.exclude?.(this.fullName, this) ?? false)) {
            return [];
        }

        return [
            ts.factory.createPropertyAssignment(
                /* name */ this.name,
                ts.factory.createCallExpression(
                    /* expression */ ts.factory.createPropertyAccessExpression(
                        /* expression */ ts.factory.createIdentifier("cqrsClient"),
                        /* name */ "createCommand",
                    ),
                    /* typeArguments */ [],
                    /* argumentsArray */ [ts.factory.createStringLiteral(this.fullName)],
                ),
            ),
        ];
    }
}
