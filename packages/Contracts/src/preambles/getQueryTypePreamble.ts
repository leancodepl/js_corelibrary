import ts from "typescript";

export default function getQueryTypePreamble() {
    return ts.factory.createTypeAliasDeclaration(
        /* decorators */ undefined,
        /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        /* name */ "Query",
        /* typeParameters */ [
            ts.factory.createTypeParameterDeclaration(
                /* name */ "TResult",
                /* constraint */ undefined,
                /* defaultType */ undefined,
            ),
        ],
        /* type */ ts.factory.createTypeLiteralNode(/* members */ undefined),
    );
}
