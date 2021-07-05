import ts from "typescript";

export default interface GeneratorContext {
    currentNamespace?: string;
    printNode: (node: ts.Node) => string;
}
