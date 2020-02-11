module.exports = {
    reporters: ["default", ["jest-junit", { outputName: "test-results/report.xml" }]],

    projects: [
        {
            displayName: "Test",
            transform: {
                "^.+\\.tsx?$": "ts-jest",
            },
            // roots: ["<rootDir>/packages/LoginManager"],
            globals: {
                "ts-jest": {
                    tsConfig: {
                        lib: ["dom", "es6"],
                    },
                },
            },
            testRegex: "(/__tests__/.*\\.spec)\\.(jsx?|tsx?)$",
            transformIgnorePatterns: ["<rootDir>/node_modules/"],
            moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
        },
        // {
        //     displayName: "ESLint",
        //     runner: "jest-runner-eslint",
        //     roots: ["<rootDir>packages"],
        //     testMatch: ["<rootDir>/packages/**/*.{ts,tsx}"],
        //     testPathIgnorePatterns: ["/node_modules", ".*/lib/.*"],
        // },
    ],
};
