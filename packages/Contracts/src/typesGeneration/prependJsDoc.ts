import ts from "typescript";
import GeneratorContext from "./GeneratorContext";

export default function prependJsDoc<TNode extends ts.Node>({
    jsDocComment,
    node,
    context,
}: {
    jsDocComment: ts.JSDoc;
    node: TNode;
    context: GeneratorContext;
}) {
    const comment = context.printNode(jsDocComment);

    return ts.addSyntheticLeadingComment(
        /* node */ node,
        /* kind */ ts.SyntaxKind.MultiLineCommentTrivia,
        /* text */ comment.substr(2, comment.length - 4),
        /* hasTrailingNewLine */ true,
    );
}
