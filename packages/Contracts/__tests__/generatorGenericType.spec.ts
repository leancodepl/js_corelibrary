import GeneratorGenericType from "../src/typesGeneration/types/GeneratorGenericType";
import { printType } from "./testUtils";

describe("GeneratorGenericType", () => {
    it("prints generic type correctly", () => {
        const generator = new GeneratorGenericType({
            generic: {
                name: "TTestType",
            },
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: TTestType;
            "
        `);
    });
});
