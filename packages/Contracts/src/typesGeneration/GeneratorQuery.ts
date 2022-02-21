import ts from "typescript";
import { GeneratorContext, GeneratorInterface } from ".";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";
import GeneratorTypeFactory from "./types/GeneratorTypeFactory";

export default class GeneratorQuery extends GeneratorInterface {
    returnType;
    queryType;

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

        const returnType = GeneratorTypeFactory.createType({
            type: ensureNotEmpty(statement.query?.returnType),
            typesDictionary,
        });

        const queryType = GeneratorTypeFactory.createType({
            type: {
                internal: {
                    name: this.id,
                },
            },
            typesDictionary,
        });

        this.returnType = returnType;
        this.queryType = queryType;
    }

    generateClient(context: GeneratorContext): ts.PropertyAssignment[] {
        if (!(context.include?.(this.id, this) ?? true) || (context.exclude?.(this.id, this) ?? false)) {
            return [];
        }

        return [
            ts.factory.createPropertyAssignment(
                /* name */ this.name,
                ts.factory.createCallExpression(
                    /* expression */ ts.factory.createPropertyAccessExpression(
                        /* expression */ ts.factory.createIdentifier("cqrsClient"),
                        /* name */ "createQuery",
                    ),
                    /* typeArguments */ [
                        this.queryType.generateType(context),
                        this.returnType.generateTypeWithNullability(context),
                    ],
                    /* argumentsArray */ [ts.factory.createStringLiteral(this.id)],
                ),
            ),
        ];
    }
}
