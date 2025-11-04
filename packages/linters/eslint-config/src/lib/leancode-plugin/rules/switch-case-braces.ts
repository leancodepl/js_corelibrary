// built on top of: https://github.com/eslint/eslint/blob/main/lib/rules/no-case-declarations.js
import type { TSESLint, TSESTree } from "@typescript-eslint/utils"

type MessageIds = keyof typeof messages
type RuleContext = TSESLint.RuleContext<MessageIds, unknown[]>
type Meta = TSESLint.RuleMetaData<MessageIds>
type Rule = TSESLint.RuleModule<MessageIds>

const messages = {
  unexpectedLexical: "Unexpected lexical declaration in case block.",
  addBraces: "Add {} braces around the case block.",
  unexpectedBracesWithNoLexical: "Unexpected braces with no lexical declaration in case block.",
  removeBraces: "Remove {} braces around the case block.",
}

const meta: Meta = {
  type: "suggestion",
  docs: {
    description: "Disallow lexical declarations in case clauses",
  },
  hasSuggestions: true,
  messages,
  schema: [],
}

const create = (context: RuleContext) => {
  /**
   * Checks whether or not a node is a lexical declaration.
   * @param {ASTNode} node A direct child statement of a switch case.
   * @returns {boolean} Whether or not the node is a lexical declaration.
   */
  function isLexicalDeclaration(node: TSESTree.Node): boolean {
    switch (node.type) {
      case "FunctionDeclaration":
      case "ClassDeclaration":
        return true
      case "VariableDeclaration":
        return node.kind !== "var"
      default:
        return false
    }
  }

  /**
   * Removes the braces from a statement.
   * @param {ASTNode} statement A statement of a switch case.
   * @returns {string} The statement without the braces.
   */
  function removeBracesFromStatement(statement: TSESTree.Node): string {
    const text = context.sourceCode.getText(statement)
    const openingBraceIndex = text.indexOf("{")
    const closingBraceIndex = text.lastIndexOf("}")

    return text.slice(openingBraceIndex + 1, closingBraceIndex)
  }

  return {
    SwitchCase(node: TSESTree.SwitchCase) {
      for (let i = 0; i < node.consequent.length; i++) {
        const statement = node.consequent[i]

        if (statement.type === "BlockStatement") {
          let hasLexicalDeclaration = false

          for (let j = 0; j < statement.body.length; j++) {
            const bodyStatement = statement.body[j]

            if (isLexicalDeclaration(bodyStatement)) {
              hasLexicalDeclaration = true
              break
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
            })
          }

          continue
        }

        if (isLexicalDeclaration(statement)) {
          context.report({
            node: statement,
            messageId: "unexpectedLexical",
            suggest: [
              {
                messageId: "addBraces",
                fix: fixer => {
                  const firstStatement = node.consequent.at(0)
                  const lastStatement = node.consequent.at(-1)

                  if (!firstStatement || !lastStatement) {
                    return []
                  }

                  return [fixer.insertTextBefore(firstStatement, "{ "), fixer.insertTextAfter(lastStatement, " }")]
                },
              },
            ],
          })
        }
      }
    },
  }
}

export const switchCaseBracesRules: Rule = {
  meta,
  create,
  defaultOptions: [],
}
