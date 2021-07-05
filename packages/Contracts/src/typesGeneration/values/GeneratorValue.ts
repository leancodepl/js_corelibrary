import ts from "typescript";

export default interface GeneratorValue {
    generateValue(): ts.Expression;
}
