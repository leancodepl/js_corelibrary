import ts from "typescript";
import GeneratorContext from "../GeneratorContext";

export default interface GeneratorType {
    isNullable: boolean;
    isAttribute: boolean;

    generateType(context: GeneratorContext): ts.TypeNode;
}
