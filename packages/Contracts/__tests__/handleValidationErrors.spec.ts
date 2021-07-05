import { join } from "path";
import generateContracts from "../src";

describe("handleValidationErrors", () => {
    it.skip("does not call any validation handler if there are no errors", async () => {
        await generateContracts({
            outDir: join(__dirname, "test-out"),
            baseNamespace: "Mindy.Core.Contracts",
            contractsFile: join(__dirname, "mindy.pb"),
            clientFile: { path: "out-client.ts", eslintExclusions: ["prettier/prettier"] },
            typesFile: { path: "out-types.ts", eslintExclusions: ["@typescript-eslint/no-namespace"] },
        });
    });
});
