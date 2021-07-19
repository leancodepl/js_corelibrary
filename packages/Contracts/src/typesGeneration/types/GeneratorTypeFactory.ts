import ts, { isIdentifier, isTypeReferenceNode } from "typescript";
import { leancode } from "../../protocol";
import GeneratorContext from "../GeneratorContext";
import GeneratorTypesDictionary from "../GeneratorTypesDictionary";
import GeneratorGenericType from "./GeneratorGenericType";
import GeneratorInternalType from "./GeneratorInternalType";
import GeneratorKnownType from "./GeneratorKnownType";
import GeneratorType from "./GeneratorType";

export default class GeneratorTypeFactory {
    static createType({
        type,
        typesDictionary,
    }: {
        type: leancode.contracts.ITypeRef;
        typesDictionary: GeneratorTypesDictionary;
    }): GeneratorType {
        const isNullable = !!type.nullable;

        if (type.generic) {
            return new GeneratorGenericType({ generic: type.generic, isNullable });
        }

        if (type.internal) {
            return new GeneratorInternalType({ internal: type.internal, isNullable, typesDictionary });
        }

        if (type.known) {
            return new GeneratorKnownType({ known: type.known, isNullable, typesDictionary });
        }

        throw new Error("Unknown type ref type");
    }

    static convertToExtendType(type: GeneratorType, context: GeneratorContext) {
        const generatedType = type.generateType(context);

        if (isTypeReferenceNode(generatedType)) {
            if (isIdentifier(generatedType.typeName)) {
                return ts.factory.createExpressionWithTypeArguments(
                    isIdentifier(generatedType.typeName)
                        ? generatedType.typeName
                        : ts.factory.createIdentifier("unknown"),
                    generatedType.typeArguments,
                );
            }
        }

        return ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier("hmm"), [generatedType]);
    }
}
