module.exports = {
  reporters: [
    "default",
    ["jest-junit", { outputName: "test-results/report.xml" }]
  ],
  projects: [
    {
      displayName: "Test",
      transform: {
        "^.+\\.tsx?$": "ts-jest"
      },
      testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
      transformIgnorePatterns: ["<rootDir>/node_modules/"],
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
    },
    {
      displayName: "ESLint",
      runner: "jest-runner-eslint",
      testMatch: ["<rootDir>/packages/**/*.{ts,tsx}"]
    }
  ]
};
