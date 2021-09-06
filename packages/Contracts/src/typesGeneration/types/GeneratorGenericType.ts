import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorType from "./GeneratorType";

export default class GeneratorGenericType extends GeneratorType {
    name;
    isNullable;
    isAttribute = false;

    constructor({ generic, isNullable }: { generic: leancode.contracts.TypeRef.IGeneric; isNullable?: boolean }) {
        super();

        const name = ensureNotEmpty(generic.name);

        this.name = name;
        this.isNullable = isNullable ?? false;
    }

    generateType(): ts.TypeNode {
        return ts.factory.createTypeReferenceNode(this.name);
    }
}
