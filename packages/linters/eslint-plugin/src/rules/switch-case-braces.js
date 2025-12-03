// built on top of: https://github.com/eslint/eslint/blob/main/lib/rules/no-case-declarations.js

/**
 * @typedef {import('@typescript-eslint/utils').TSESLint.RuleModule<MessageIds, []>} Rule
 * @typedef {import('@typescript-eslint/utils').TSESLint.RuleContext<MessageIds, []>} RuleContext
 * @typedef {import('@typescript-eslint/utils').TSESTree.Node} Node
 * @typedef {import('@typescript-eslint/utils').TSESTree.SwitchCase} SwitchCase
 * @typedef {'unexpectedLexical' | 'addBraces' | 'unexpectedBracesWithNoLexical' | 'removeBraces'} MessageIds
 */

const messages = {
  unexpectedLexical: "Unexpected lexical declaration in case block.",
  addBraces: "Add {} braces around the case block.",
  unexpectedBracesWithNoLexical: "Unexpected braces with no lexical declaration in case block.",
  removeBraces: "Remove {} braces around the case block.",
}

/** @type {import('@typescript-eslint/utils').TSESLint.RuleMetaData<MessageIds>} */
const meta = {
  type: "suggestion",
  docs: {
    description:
      "Enforce braces around case blocks with lexical declarations. Enforce braces removal when there are no lexical declarations.",
  },
  hasSuggestions: true,
  messages,
  schema: [],
}

/**
 * @param {RuleContext} context
 * @returns {import('@typescript-eslint/utils').TSESLint.RuleListener}
 */
const create = context => {
  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function isLexicalDeclaration(node) {
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
   * @param {Node} statement
   * @returns {string}
   */
  function removeBracesFromStatement(statement) {
    const text = context.sourceCode.getText(statement)
    const openingBraceIndex = text.indexOf("{")
    const closingBraceIndex = text.lastIndexOf("}")

    return text.slice(openingBraceIndex + 1, closingBraceIndex)
  }

  return {
    /**
     * @param {SwitchCase} node
     */
    SwitchCase(node) {
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

/** @type {Rule} */
const switchCaseBracesRules = {
  meta,
  create,
  defaultOptions: [],
}

module.exports = { switchCaseBracesRules }
