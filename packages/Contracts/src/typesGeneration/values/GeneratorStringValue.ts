import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorValue from "./GeneratorValue";

export default class GeneratorStringValue implements GeneratorValue {
    value;

    constructor({ stringValue }: { stringValue: leancode.contracts.ValueRef.IString }) {
        const value = ensureNotEmpty(stringValue.value);

        this.value = value;
    }

    generateValue(): ts.Expression {
        return ts.factory.createStringLiteral(this.value);
    }
}
