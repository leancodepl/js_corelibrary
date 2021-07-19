import ts from "typescript";

export default function getCommandTypePreamble() {
    return ts.factory.createTypeAliasDeclaration(
        /* decorators */ undefined,
        /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        /* name */ "Command",
        /* typeParameters */ undefined,
        /* type */ ts.factory.createTypeLiteralNode(/* members */ undefined),
    );
}
