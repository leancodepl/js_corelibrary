const config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.js"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  preset: "../../jest.preset.js",
}

export default config
