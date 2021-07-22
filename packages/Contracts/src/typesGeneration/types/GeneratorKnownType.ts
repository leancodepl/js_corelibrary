import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorContext from "../GeneratorContext";
import GeneratorTypesDictionary from "../GeneratorTypesDictionary";
import GeneratorType from "./GeneratorType";
import GeneratorTypeFactory from "./GeneratorTypeFactory";

const defaultTypesMap: Record<
    leancode.contracts.KnownType,
    (config: { typeArguments: GeneratorType[]; context: GeneratorContext }) => ts.TypeNode | undefined
> = {
    [leancode.contracts.KnownType.Object]: () =>
        ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Partial"), [
            ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Record"), [
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            ]),
        ]),
    [leancode.contracts.KnownType.String]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.Guid]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.Uri]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.Date]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.Time]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.DateTime]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.DateTimeOffset]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.TimeSpan]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [leancode.contracts.KnownType.Boolean]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
    [leancode.contracts.KnownType.UInt8]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Int8]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.UInt16]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Int16]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.UInt32]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Int32]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.UInt64]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Int64]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Float]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Double]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Decimal]: () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [leancode.contracts.KnownType.Array]: ({ typeArguments, context }) =>
        ts.factory.createArrayTypeNode(ensureNotEmpty(typeArguments[0]).generateType(context)),
    [leancode.contracts.KnownType.Map]: ({ typeArguments, context }) => {
        const keyType = ensureNotEmpty(typeArguments[0]);
        const valueType = ensureNotEmpty(typeArguments[1]);

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
    },
    [leancode.contracts.KnownType.Query]: ({ typeArguments, context }) =>
        ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Query"), [
            ensureNotEmpty(typeArguments[0]).generateType(context),
        ]),
    [leancode.contracts.KnownType.Command]: () =>
        ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Command")),
    [leancode.contracts.KnownType.AuthorizeWhenAttribute]: () => undefined,
    [leancode.contracts.KnownType.AuthorizeWhenHasAnyOfAttribute]: () => undefined,
    [leancode.contracts.KnownType.QueryCacheAttribute]: () => undefined,
    [leancode.contracts.KnownType.Attribute]: () => undefined,
};

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
        const typesMap = { ...defaultTypesMap, ...context.customTypes };

        const outputType = typesMap[this.type]({ typeArguments: this.typeArguments, context });

        if (outputType === undefined) {
            throw new Error("Type not supported.");
        }

        return outputType;
    }
}
