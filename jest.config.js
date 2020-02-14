module.exports = {
    reporters: ["default", ["jest-junit", { outputName: "test-results/report.xml" }]],

    projects: [
        "<rootDir>/packages/*/jest.config.js",
        {
            displayName: "ESLint",
            runner: "jest-runner-eslint",
            roots: ["<rootDir>packages"],
            testMatch: ["<rootDir>/packages/**/*.{ts,tsx}"],
            testPathIgnorePatterns: ["/node_modules", ".*/lib/.*"],
        },
    ],
};
