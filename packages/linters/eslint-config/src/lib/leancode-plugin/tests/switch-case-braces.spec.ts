const { RuleTester } = require("@typescript-eslint/rule-tester")
const ruleFile = require("../rules/switch-case-braces")

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
})

const unexpectedBracesWithNoLexical = {
  valid: `switch (test) { case "test": console.log("test"); break; }`,
  invalid: `switch (test) { case "test": { console.log("test"); break; } }`,
  output: `switch (test) { case "test":  console.log("test"); break;  }`,
}

const unexpectedLexical = {
  valid: `switch (test) { case "test": { const test = "test"; console.log("test"); break; } }`,
  invalid: `switch (test) { case "test": const test = "test"; console.log("test"); break; }`,
  output: `switch (test) { case "test": { const test = "test"; console.log("test"); break; } }`,
}

ruleTester.run("switch-case-braces", ruleFile, {
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

// eslint-disable-next-line no-console
console.log("All tests passed!")
