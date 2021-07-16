import ts from "typescript";
import { GeneratorInterface } from ".";
import { leancode } from "../protocol";
import extractMinimalReferenceTypeName from "../utils/extractMinimalReferenceTypeName";
import { assertNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import GeneratorErrorCodes from "./GeneratorErrorCodes";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";
import GeneratorTypeFactory from "./types/GeneratorTypeFactory";

export default class GeneratorCommand extends GeneratorInterface {
    errorCodes;
    commandType;

    private typesDictionary;

    constructor({
        statement,
        typesDictionary,
        nameTransform,
    }: {
        statement: leancode.contracts.IStatement;
        typesDictionary: GeneratorTypesDictionary;
        nameTransform?: (name: string) => string;
    }) {
        super({ statement, typesDictionary, nameTransform });

        assertNotEmpty(statement.command);

        const errorCodes = new GeneratorErrorCodes({ errorCodes: statement.command.errorCodes ?? [] });

        const commandType = GeneratorTypeFactory.createType({
            type: {
                internal: {
                    name: this.id,
                },
            },
            typesDictionary,
        });

        this.errorCodes = errorCodes;
        this.commandType = commandType;
        this.typesDictionary = typesDictionary;
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
        if (!(context.include?.(this.id, this) ?? true) || (context.exclude?.(this.id, this) ?? false)) {
            return [];
        }

        const errorCodesType = this.errorCodes.hasErrors
            ? ts.factory.createTypeReferenceNode(
                  /* typeName */ extractMinimalReferenceTypeName(
                      this.fullName + ".ErrorCodes",
                      context.currentNamespace,
                  ),
                  /* typeArguments */ undefined,
              )
            : ts.factory.createTypeLiteralNode(/* members */ undefined);

        const errorCodesArgument = this.errorCodes.hasErrors
            ? ts.factory.createPropertyAccessExpression(
                  /* expression */ ts.factory.createIdentifier(
                      extractMinimalReferenceTypeName(this.fullName, context.currentNamespace),
                  ),
                  /* name */ "ErrorCodes",
              )
            : ts.factory.createObjectLiteralExpression(/* properties */ undefined, /* multiline */ false);

        return [
            ts.factory.createPropertyAssignment(
                /* name */ this.name,
                ts.factory.createCallExpression(
                    /* expression */ ts.factory.createPropertyAccessExpression(
                        /* expression */ ts.factory.createIdentifier("cqrsClient"),
                        /* name */ "createCommand",
                    ),
                    /* typeArguments */ [this.commandType.generateType(context), errorCodesType],
                    /* argumentsArray */ [ts.factory.createStringLiteral(this.id), errorCodesArgument],
                ),
            ),
        ];
    }
}
