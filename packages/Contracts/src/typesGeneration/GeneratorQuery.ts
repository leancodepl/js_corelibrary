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
    }: {
        statement: leancode.contracts.IStatement;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        super({ statement, typesDictionary });

        const returnType = GeneratorTypeFactory.createType({
            type: ensureNotEmpty(statement.query?.returnType),
            typesDictionary,
        });

        const queryType = GeneratorTypeFactory.createType({
            type: {
                internal: {
                    name: this.fullName,
                },
            },
            typesDictionary,
        });

        this.returnType = returnType;
        this.queryType = queryType;
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
                        /* name */ "createQuery",
                    ),
                    /* typeArguments */ [this.queryType.generateType(context), this.returnType.generateType(context)],
                    /* argumentsArray */ [ts.factory.createStringLiteral(this.fullName)],
                ),
            ),
        ];

        // return [
        //     ts.factory.createPropertyAssignment(
        //         /* name */ this.name,
        //         /* initializer */ ts.factory.createArrowFunction(
        //             /* modifiers */ undefined,
        //             /* typeParameters */ undefined,
        //             /* parameters */ [
        //                 ts.factory.createParameterDeclaration(
        //                     /* decorators */ undefined,
        //                     /* modifiers */ undefined,
        //                     /* dotDotDotToken */ undefined,
        //                     /* name */ "dto",
        //                     /* questionToken */ undefined,
        //                     /* type */ ts.factory.createTypeReferenceNode(queryName),
        //                     /* initializer */ undefined,
        //                 ),
        //             ],
        //             /* type */ undefined,
        //             /* equalsGreaterThanToken */ undefined,
        //             /* body */
        //             ts.factory.createCallExpression(
        //                 /* expression */ ts.factory.createPropertyAccessExpression(
        //                     /* expression */ ts.factory.createIdentifier("cqrsClient"),
        //                     /* name */ "executeQuery",
        //                 ),
        //                 /* typeArguments */ [this.returnType.generateType(context)],
        //                 /* argumentsArray */ [
        //                     ts.factory.createStringLiteral(this.fullName),
        //                     ts.factory.createIdentifier("dto"),
        //                 ],
        //             ),
        //         ),
        //     ),
        // ];
    }
}
