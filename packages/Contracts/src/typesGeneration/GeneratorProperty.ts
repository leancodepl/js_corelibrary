import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorAttribute from "./GeneratorAttribute";
import GeneratorContext from "./GeneratorContext";
import GeneratorTypesDictionary from "./GeneratorTypesDictionary";
import prependJsDoc from "./prependJsDoc";
import GeneratorTypeFactory from "./types/GeneratorTypeFactory";

export default class GeneratorProperty {
    isNullable;
    name;
    comment;
    attributes;
    type;

    constructor({
        property,
        typesDictionary,
    }: {
        property: leancode.contracts.IPropertyRef;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        const name = ensureNotEmpty(property.name);
        const attributes = property.attributes?.map(attribute => new GeneratorAttribute({ attribute })) ?? [];

        this.isNullable = !!property.type?.nullable;
        this.name = name;
        this.comment = property.comment ?? undefined;
        this.attributes = attributes;
        this.type = GeneratorTypeFactory.createType({ type: ensureNotEmpty(property.type), typesDictionary });
    }

    generateTypeElement(context: GeneratorContext): ts.TypeElement {
        const propertySignature = ts.factory.createPropertySignature(
            /* modifiers */ [],
            /* name */ this.name,
            /* questionToken */ this.isNullable ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
            /* type */ this.type.generateType(context),
        );

        if (this.comment || this.attributes.length > 0) {
            const jsDocComment = ts.factory.createJSDocComment(
                this.comment,
                this.attributes.map(attribute => attribute.generateAttribute()),
            );

            return prependJsDoc({
                jsDocComment,
                node: propertySignature,
                context,
            });
        }

        return propertySignature;
    }
}
