import ts from "typescript";
import GeneratorValue from "./GeneratorValue";

export default class GeneratorNullValue implements GeneratorValue {
    generateValue(): ts.Expression {
        return ts.factory.createToken(ts.SyntaxKind.NullKeyword);
    }
}
