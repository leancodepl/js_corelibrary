import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorContext from "../GeneratorContext";
import GeneratorTypesDictionary from "../GeneratorTypesDictionary";
import GeneratorType from "./GeneratorType";
import GeneratorTypeFactory from "./GeneratorTypeFactory";

export default class GeneratorKnownType implements GeneratorType {
    type;
    typeArguments;
    isNullable;
    get isAttribute() {
        return [
            leancode.contracts.KnownType.Attribute,
            leancode.contracts.KnownType.AuthorizeWhenAttribute,
            leancode.contracts.KnownType.AuthorizeWhenHasAnyOfAttribute,
        ].includes(this.type);
    }

    constructor({
        known,
        isNullable,
        typesDictionary,
    }: {
        known: leancode.contracts.TypeRef.IKnown;
        isNullable?: boolean;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        const type = ensureNotEmpty(known.type);
        const typeArguments =
            known.arguments?.map(argument => GeneratorTypeFactory.createType({ type: argument, typesDictionary })) ??
            [];

        this.type = type;
        this.typeArguments = typeArguments;
        this.isNullable = isNullable ?? false;
    }

    generateType(context: GeneratorContext): ts.TypeNode {
        switch (this.type) {
            case leancode.contracts.KnownType.Object:
                return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Partial"), [
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Record"), [
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                    ]),
                ]);
            case leancode.contracts.KnownType.String:
            case leancode.contracts.KnownType.Guid:
            case leancode.contracts.KnownType.Uri:
            case leancode.contracts.KnownType.Date:
            case leancode.contracts.KnownType.Time:
            case leancode.contracts.KnownType.DateTime:
            case leancode.contracts.KnownType.DateTimeOffset:
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case leancode.contracts.KnownType.Boolean:
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case leancode.contracts.KnownType.UInt8:
            case leancode.contracts.KnownType.Int8:
            case leancode.contracts.KnownType.UInt16:
            case leancode.contracts.KnownType.Int16:
            case leancode.contracts.KnownType.UInt32:
            case leancode.contracts.KnownType.Int32:
            case leancode.contracts.KnownType.UInt64:
            case leancode.contracts.KnownType.Int64:
            case leancode.contracts.KnownType.Float:
            case leancode.contracts.KnownType.Double:
            case leancode.contracts.KnownType.Decimal:
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case leancode.contracts.KnownType.Array:
                return ts.factory.createArrayTypeNode(ensureNotEmpty(this.typeArguments[0]).generateType(context));
            case leancode.contracts.KnownType.Map: {
                const keyType = ensureNotEmpty(this.typeArguments[0]);
                const valueType = ensureNotEmpty(this.typeArguments[1]);

                const isNullable = !!valueType.isNullable;

                return ts.factory.createMappedTypeNode(
                    /* readonlyToken */ undefined,
                    /* typeParameter */ ts.factory.createTypeParameterDeclaration(
                        /* name */ "key",
                        /* constraint */ keyType.generateType(context),
                        /* defaultType */ undefined,
                    ),
                    /* typeNode */ undefined,
                    /* questionToken */ isNullable ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
                    /* type */ ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                );
            }
            case leancode.contracts.KnownType.Query:
                return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Query"), [
                    ensureNotEmpty(this.typeArguments[0]).generateType(context),
                ]);
            case leancode.contracts.KnownType.Command: {
                return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Command"));
            }
        }

        throw new Error("Type not supported.");
    }
}
