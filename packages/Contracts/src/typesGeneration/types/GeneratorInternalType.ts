import ts from "typescript";
import { leancode } from "../../protocol";
import extractMinimalReferenceTypeName from "../../utils/extractMinimalReferenceTypeName";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorContext from "../GeneratorContext";
import GeneratorTypesDictionary from "../GeneratorTypesDictionary";
import GeneratorType from "./GeneratorType";
import GeneratorTypeFactory from "./GeneratorTypeFactory";

export default class GeneratorInternalType implements GeneratorType {
    name;
    isNullable;
    typeArguments;

    get isAttribute() {
        return this.#typesDictionary.interfaces[this.name].isAttribute;
    }

    #typesDictionary;

    constructor({
        internal,
        isNullable,
        typesDictionary,
    }: {
        internal: leancode.contracts.TypeRef.IInternal;
        isNullable?: boolean;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        const name = ensureNotEmpty(internal.name);
        const typeArguments =
            internal.arguments?.map(argument => GeneratorTypeFactory.createType({ type: argument, typesDictionary })) ??
            [];

        this.#typesDictionary = typesDictionary;
        this.typeArguments = typeArguments;
        this.name = name;
        this.isNullable = isNullable ?? false;
    }

    generateType(context: GeneratorContext): ts.TypeNode {
        const name = extractMinimalReferenceTypeName(this.name, context.currentNamespace);

        return ts.factory.createTypeReferenceNode(
            /* typeName */ name,
            /* typeArguments */ this.typeArguments.map(argument => argument.generateType(context)),
        );
    }
}
