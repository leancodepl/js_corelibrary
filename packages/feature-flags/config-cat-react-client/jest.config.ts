/* eslint-disable */
export default {
    displayName: "config-cat-react-client",
    preset: "../../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": [
            "@swc/jest",
            { jsc: { parser: { syntax: "typescript", tsx: true }, transform: { react: { runtime: "automatic" } } } },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/packages/feature-flags/config-cat-react-client",
}
