import ts from "typescript";
import { leancode } from "../protocol";
import { assertNotEmpty, ensureNotEmpty } from "../utils/notEmpty";
import GeneratorAttribute from "./GeneratorAttribute";
import GeneratorConstant from "./GeneratorConstant";
import GeneratorContext from "./GeneratorContext";
import GeneratorProperty from "./GeneratorProperty";
import GeneratorStatement from "./GeneratorStatement";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";
import prependJsDoc from "./prependJsDoc";
import GeneratorTypeFactory from "./types/GeneratorTypeFactory";

export default class GeneratorInterface implements GeneratorStatement {
    name;
    fullName;
    genericParameters;
    properties;
    comment;
    attributes;
    extendTypes;
    constants;

    get isAttribute() {
        return this.extendTypes.some(t => t.isAttribute);
    }

    constructor({
        statement,
        typesDictionary,
    }: {
        statement: leancode.contracts.IStatement;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        const fullName = ensureNotEmpty(statement.name);
        const genericParameters = statement.genericParameters?.map(p => ensureNotEmpty(p.name)) ?? [];
        const properties =
            statement.properties?.map(property => new GeneratorProperty({ property, typesDictionary })) ?? [];
        const attributes = statement.attributes?.map(attribute => new GeneratorAttribute({ attribute })) ?? [];
        const extendTypes =
            statement.extends?.map(extendType =>
                GeneratorTypeFactory.createType({ type: extendType, typesDictionary }),
            ) ?? [];
        const constants = statement.constants?.map(constant => new GeneratorConstant(constant)) ?? [];

        this.fullName = fullName;
        this.name = GeneratorInterface.getNameFromFullName(fullName);
        this.genericParameters = genericParameters;
        this.properties = properties;
        this.comment = statement.comment ?? undefined;
        this.attributes = attributes;
        this.extendTypes = extendTypes;
        this.constants = constants;
    }

    private static getNameFromFullName(name: string | null | undefined) {
        assertNotEmpty(name);

        const parts = name.split(".");

        return parts[parts.length - 1];
    }

    generateStatements(context: GeneratorContext): ts.Statement[] {
        if (this.isAttribute) {
            return [];
        }

        const typeParameters = this.genericParameters.map(p => ts.factory.createTypeParameterDeclaration(p));

        const extendTypes =
            this.extendTypes.map(extendType => GeneratorTypeFactory.convertToExtendType(extendType, context)) ?? [];

        const interfaceStatement = ts.factory.createInterfaceDeclaration(
            /* decorators */ [],
            /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            /* name */ this.name,
            /* typeParameters */ typeParameters,
            /* heritageClauses */ extendTypes.length > 0
                ? [ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, extendTypes)]
                : undefined,
            /* members */ this.properties.map(property => property.generateTypeElement(context)),
        );

        const constants = this.generateConstants(context);

        if (this.comment || this.attributes.length > 0) {
            const jsDocComment = ts.factory.createJSDocComment(
                this.comment,
                this.attributes.map(attribute => attribute.generateAttribute()),
            );

            return [
                prependJsDoc({
                    context,
                    jsDocComment,
                    node: interfaceStatement,
                }),
                ...constants,
            ];
        }

        return [interfaceStatement, ...constants];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateClient(context: GeneratorContext): ts.PropertyAssignment[] {
        return [];
    }

    private generateConstants(context: GeneratorContext): ts.Statement[] {
        if (this.constants.length < 1) {
            return [];
        }
        return [
            ts.factory.createVariableStatement(
                /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                /* declarationList */ ts.factory.createVariableDeclarationList(
                    /* declarations */ [
                        ts.factory.createVariableDeclaration(
                            /* name */ this.name,
                            /* exclamationToken */ undefined,
                            /* type */ undefined,
                            /* intializer */ ts.factory.createAsExpression(
                                /* expression */ ts.factory.createObjectLiteralExpression(
                                    /* properties */ this.constants.map(constant => constant.generateConstant(context)),
                                    /* multiline */ true,
                                ),
                                /* type */ ts.factory.createTypeReferenceNode("const"),
                            ),
                        ),
                    ],
                    /* flags */ ts.NodeFlags.Const,
                ),
            ),
        ];
    }
}
