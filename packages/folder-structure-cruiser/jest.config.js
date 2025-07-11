module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.spec.js"],
    collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js", "!src/**/*.spec.js"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
}
