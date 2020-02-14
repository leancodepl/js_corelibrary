const path = require("path");

module.exports = packageRoot => {
    const packageJson = require(path.join(packageRoot, "package.json"));

    return {
        displayName: packageJson.name,
        transform: {
            "^.+\\.tsx?$": "ts-jest",
        },
        testRegex: "(/__tests__/.*\\.spec)\\.(jsx?|tsx?)$",
        transformIgnorePatterns: ["<rootDir>/node_modules/"],
        moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    };
};
