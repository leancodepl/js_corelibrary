const { RuleTester } = require("@typescript-eslint/rule-tester")
const { switchCaseBracesRules } = require("../rules/switch-case-braces.js")

/** @type {import('@typescript-eslint/rule-tester').RuleTester} */
const ruleTester = new RuleTester({})

/**
 * @typedef {Object} TestCase
 * @property {string} valid - Valid code example
 * @property {string} invalid - Invalid code example
 * @property {string} output - Expected output after fix
 */

/** @type {TestCase} */
const unexpectedBracesWithNoLexical = {
  valid: `switch (test) { case "test": console.log("test"); break; }`,
  invalid: `switch (test) { case "test": { console.log("test"); break; } }`,
  output: `switch (test) { case "test":  console.log("test"); break;  }`,
}

/** @type {TestCase} */
const unexpectedLexical = {
  valid: `switch (test) { case "test": { const test = "test"; console.log("test"); break; } }`,
  invalid: `switch (test) { case "test": const test = "test"; console.log("test"); break; }`,
  output: `switch (test) { case "test": { const test = "test"; console.log("test"); break; } }`,
}

ruleTester.run("switch-case-braces", switchCaseBracesRules, {
  valid: [
    {
      code: unexpectedBracesWithNoLexical.valid,
    },
    {
      code: unexpectedLexical.valid,
    },
  ],
  invalid: [
    {
      code: unexpectedBracesWithNoLexical.invalid,
      output: null,
      errors: [
        {
          messageId: "unexpectedBracesWithNoLexical",
          suggestions: [
            {
              messageId: "removeBraces",
              output: unexpectedBracesWithNoLexical.output,
            },
          ],
        },
      ],
    },
    {
      code: unexpectedLexical.invalid,
      output: null,
      errors: [
        {
          messageId: "unexpectedLexical",
          suggestions: [
            {
              messageId: "addBraces",
              output: unexpectedLexical.output,
            },
          ],
        },
      ],
    },
  ],
})
