import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";

export default class GeneratorErrorCodes {
    errorCodes;

    get hasErrors() {
        return this.errorCodes.length > 0;
    }

    constructor({ errorCodes }: { errorCodes: leancode.contracts.IErrorCode[] }) {
        this.errorCodes = GeneratorErrorCodes.convertErrorCodes(errorCodes);
    }

    generateErrorCodes() {
        if (!this.hasErrors) {
            return undefined;
        }

        return [
            ts.factory.createVariableStatement(
                /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                /* declarationList */ ts.factory.createVariableDeclarationList(
                    /* declarations */ [
                        ts.factory.createVariableDeclaration(
                            /* name */ "ErrorCodes",
                            /* exclamationToken */ undefined,
                            /* type */ undefined,
                            /* intializer */ ts.factory.createAsExpression(
                                /* expression */ ts.factory.createObjectLiteralExpression(
                                    /* properties */ this.errorCodes.map(errorCode =>
                                        ts.factory.createPropertyAssignment(
                                            /* name */ errorCode.name,
                                            /* initializer */ ts.factory.createNumericLiteral(errorCode.code),
                                        ),
                                    ),
                                    /* multiline */ true,
                                ),
                                /* type */ ts.factory.createTypeReferenceNode("const"),
                            ),
                        ),
                    ],
                    /* flags */ ts.NodeFlags.Const,
                ),
            ),
            ts.factory.createTypeAliasDeclaration(
                /* decorators */ undefined,
                /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                /* name */ "ErrorCodes",
                /* typeParameters */ undefined,
                /* type */ ts.factory.createTypeQueryNode(/* exprName */ ts.factory.createIdentifier("ErrorCodes")),
            ),
        ];
    }

    private static convertErrorCodes(errorCodes: leancode.contracts.IErrorCode[]): { name: string; code: number }[] {
        return errorCodes.flatMap(code => {
            if (code.single) {
                return [
                    {
                        name: ensureNotEmpty(code.single.name),
                        code: ensureNotEmpty(code.single.code),
                    },
                ];
            }
            return this.convertErrorCodes(ensureNotEmpty(code.group?.innerCodes));
        });
    }
}
