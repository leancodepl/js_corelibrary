import ts from "typescript";
import { leancode } from "../../protocol";
import ensureDefined from "../../utils/ensureDefined";
import extractMinimalReferenceTypeName from "../../utils/extractMinimalReferenceTypeName";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorContext from "../GeneratorContext";
import GeneratorInterface from "../GeneratorInterface";
import GeneratorTypesDictionary from "../GeneratorTypesDictionary";
import GeneratorType from "./GeneratorType";
import GeneratorTypeFactory from "./GeneratorTypeFactory";

export default class GeneratorInternalType extends GeneratorType {
    id;
    isNullable;
    typeArguments;

    get isAttribute() {
        if (this.relatedInterface instanceof GeneratorInterface) {
            return this.relatedInterface.isAttribute;
        }

        return false;
    }

    get relatedInterface() {
        return ensureDefined(
            this.typesDictionary.statements[this.id],
            `Internal type with id ${this.id} couldn't be found in types dictionary`,
        );
    }

    private typesDictionary;

    constructor({
        internal,
        isNullable,
        typesDictionary,
    }: {
        internal: leancode.contracts.TypeRef.IInternal;
        isNullable?: boolean;
        typesDictionary: GeneratorTypesDictionary;
    }) {
        super();

        const id = ensureNotEmpty(internal.name);
        const typeArguments =
            internal.arguments?.map(argument => GeneratorTypeFactory.createType({ type: argument, typesDictionary })) ??
            [];

        this.typesDictionary = typesDictionary;
        this.typeArguments = typeArguments;
        this.id = id;
        this.isNullable = isNullable ?? false;
    }

    generateType(context: GeneratorContext): ts.TypeNode {
        context.referencedInternalTypes.add(this);

        const name = extractMinimalReferenceTypeName(this.relatedInterface.fullName, context.currentNamespace);

        return ts.factory.createTypeReferenceNode(
            /* typeName */ name,
            /* typeArguments */ this.typeArguments.map(argument => argument.generateType(context)),
        );
    }
}
