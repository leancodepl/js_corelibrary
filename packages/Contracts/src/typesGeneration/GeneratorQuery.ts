import ts from "typescript";
import { GeneratorInterface } from ".";
import { leancode } from "../protocol";
import extractMinimalReferenceTypeName from "../utils/extractMinimalReferenceTypeName";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";
import GeneratorTypeFactory from "./types/GeneratorTypeFactory";

export default class GeneratorQuery extends GeneratorInterface {
    returnType;

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

        this.returnType = returnType;
    }

    generateClient(context: GeneratorContext): ts.PropertyAssignment[] {
        const queryName = extractMinimalReferenceTypeName(this.fullName, context.currentNamespace);

        return [
            ts.factory.createPropertyAssignment(
                /* name */ this.name,
                ts.factory.createCallExpression(
                    /* expression */ ts.factory.createPropertyAccessExpression(
                        /* expression */ ts.factory.createIdentifier("cqrsClient"),
                        /* name */ "createQuery",
                    ),
                    /* typeArguments */ [
                        ts.factory.createTypeReferenceNode(queryName),
                        this.returnType.generateType(context),
                    ],
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
