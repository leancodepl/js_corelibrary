const config = {
  displayName: "@leancodepl/intl",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/intl",
}

export default config
