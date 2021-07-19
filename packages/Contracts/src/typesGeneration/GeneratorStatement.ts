import ts from "typescript";
import GeneratorContext from "./GeneratorContext";

export default interface GeneratorStatement {
    id: string;
    fullName: string;

    generateStatements(context: GeneratorContext): ts.Statement[];
    generateClient(context: GeneratorContext): ts.PropertyAssignment[];
}
