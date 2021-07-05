import ts from "typescript";
import GeneratorContext from "./GeneratorContext";

export default interface GeneratorStatement {
    generateStatements(context: GeneratorContext): ts.Statement[];
    generateClient(context: GeneratorContext): ts.PropertyAssignment[];
}
