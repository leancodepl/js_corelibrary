import ts from "typescript";
import GeneratorContext from "./GeneratorContext";
import GeneratorStatement from "./GeneratorStatement";

export default class GeneratorNamespace implements GeneratorStatement {
    id;
    fullName;
    name;
    statements;

    constructor({ name, statements }: { name: string; statements: GeneratorStatement[] }) {
        this.id = name;
        this.fullName = name;
        this.name = name;
        this.statements = statements;
    }

    generateStatements(context: GeneratorContext) {
        return [
            ts.factory.createModuleDeclaration(
                /* decorators */ undefined,
                /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                /* name */ ts.factory.createIdentifier(this.name),
                /* body */ ts.factory.createModuleBlock(
                    this.statements.flatMap(s =>
                        s.generateStatements({
                            ...context,
                            currentNamespace: [context.currentNamespace, this.name].filter(Boolean).join("."),
                        }),
                    ),
                ),
                /* flags */ ts.NodeFlags.Namespace,
            ),
        ];
    }

    generateClient(context: GeneratorContext) {
        const properties = this.statements.flatMap(statement => statement.generateClient(context));

        if (properties.length === 0) {
            return [];
        }

        return [
            ts.factory.createPropertyAssignment(
                /* name */ this.name,
                /* initializer */ ts.factory.createObjectLiteralExpression(
                    /* properties */ properties,
                    /* multiline */ true,
                ),
            ),
        ];
    }
}
