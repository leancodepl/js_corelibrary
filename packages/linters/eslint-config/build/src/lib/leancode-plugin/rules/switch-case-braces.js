"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages = {
    unexpectedLexical: "Unexpected lexical declaration in case block.",
    addBraces: "Add {} braces around the case block.",
    unexpectedBracesWithNoLexical: "Unexpected braces with no lexical declaration in case block.",
    removeBraces: "Remove {} braces around the case block.",
};
const meta = {
    type: "suggestion",
    docs: {
        description: "Disallow lexical declarations in case clauses",
    },
    hasSuggestions: true,
    messages,
    schema: [],
};
const create = (context) => {
    /**
     * Checks whether or not a node is a lexical declaration.
     * @param {ASTNode} node A direct child statement of a switch case.
     * @returns {boolean} Whether or not the node is a lexical declaration.
     */
    function isLexicalDeclaration(node) {
        switch (node.type) {
            case "FunctionDeclaration":
            case "ClassDeclaration":
                return true;
            case "VariableDeclaration":
                return node.kind !== "var";
            default:
                return false;
        }
    }
    /**
     * Removes the braces from a statement.
     * @param {ASTNode} statement A statement of a switch case.
     * @returns {string} The statement without the braces.
     */
    function removeBracesFromStatement(statement) {
        const text = context.sourceCode.getText(statement);
        const openingBraceIndex = text.indexOf("{");
        const closingBraceIndex = text.lastIndexOf("}");
        return text.slice(openingBraceIndex + 1, closingBraceIndex);
    }
    return {
        SwitchCase(node) {
            for (let i = 0; i < node.consequent.length; i++) {
                const statement = node.consequent[i];
                if (statement.type === "BlockStatement") {
                    let hasLexicalDeclaration = false;
                    for (let j = 0; j < statement.body.length; j++) {
                        const bodyStatement = statement.body[j];
                        if (isLexicalDeclaration(bodyStatement)) {
                            hasLexicalDeclaration = true;
                            break;
                        }
                    }
                    if (!hasLexicalDeclaration) {
                        context.report({
                            node: statement,
                            messageId: "unexpectedBracesWithNoLexical",
                            suggest: [
                                {
                                    messageId: "removeBraces",
                                    fix: fixer => [fixer.replaceText(statement, removeBracesFromStatement(statement))],
                                },
                            ],
                        });
                    }
                    continue;
                }
                if (isLexicalDeclaration(statement)) {
                    context.report({
                        node: statement,
                        messageId: "unexpectedLexical",
                        suggest: [
                            {
                                messageId: "addBraces",
                                fix: fixer => {
                                    const firstStatement = node.consequent.at(0);
                                    const lastStatement = node.consequent.at(-1);
                                    if (!firstStatement || !lastStatement) {
                                        return [];
                                    }
                                    return [fixer.insertTextBefore(firstStatement, "{ "), fixer.insertTextAfter(lastStatement, " }")];
                                },
                            },
                        ],
                    });
                }
            }
        },
    };
};
const rule = {
    meta,
    create,
    defaultOptions: [],
};
exports.default = rule;
//# sourceMappingURL=switch-case-braces.js.map