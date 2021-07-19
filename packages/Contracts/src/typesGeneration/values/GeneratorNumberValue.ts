import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorValue from "./GeneratorValue";

export default class GeneratorNumberValue implements GeneratorValue {
    value;

    constructor({
        numberOrFloat,
    }: {
        numberOrFloat:
            | leancode.contracts.ValueRef.INumber
            | leancode.contracts.ValueRef.IFloatingPointNumber
            | leancode.contracts.IEnumValue;
    }) {
        const value = ensureNotEmpty(numberOrFloat.value).toString();

        this.value = value;
    }

    generateValue(): ts.Expression {
        return ts.factory.createNumericLiteral(this.value);
    }
}
