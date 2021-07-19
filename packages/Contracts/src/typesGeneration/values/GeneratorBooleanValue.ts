import ts from "typescript";
import { leancode } from "../../protocol";
import { ensureNotEmpty } from "../../utils/notEmpty";
import GeneratorValue from "./GeneratorValue";

export default class GeneratorBooleanValue implements GeneratorValue {
    value;

    constructor({ boolValue }: { boolValue: leancode.contracts.ValueRef.IBoolean }) {
        const value = ensureNotEmpty(boolValue.value);

        this.value = value;
    }

    generateValue(): ts.Expression {
        return this.value
            ? ts.factory.createToken(ts.SyntaxKind.TrueKeyword)
            : ts.factory.createToken(ts.SyntaxKind.FalseKeyword);
    }
}
