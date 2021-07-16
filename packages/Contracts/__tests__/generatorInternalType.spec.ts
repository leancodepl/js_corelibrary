import { leancode } from "../src/protocol";
import GeneratorInternalType from "../src/typesGeneration/types/GeneratorInternalType";
import { mkTypesDictionary, printType } from "./testUtils";

describe("GeneratorInternalType", () => {
    it("prints internal type correctly", () => {
        const typesDictionary = mkTypesDictionary(["InternalType"]);
        const generator = new GeneratorInternalType({
            internal: {
                name: "InternalType",
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: InternalType;
            "
        `);
    });

    it("prints generic internal type correctly", () => {
        const typesDictionary = mkTypesDictionary(["GenericInternalType"]);
        const generator = new GeneratorInternalType({
            internal: {
                name: "GenericInternalType",
                arguments: [
                    {
                        known: { type: leancode.contracts.KnownType.String },
                    },
                ],
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: GenericInternalType<string>;
            "
        `);
    });

    it("prints internal type correctly when nested", () => {
        const typesDictionary = mkTypesDictionary(["A.B.C.InternalType"]);
        const generator = new GeneratorInternalType({
            internal: {
                name: "A.B.C.InternalType",
            },
            typesDictionary,
        });

        const output = printType(generator, ctx => ({
            ...ctx,
            currentNamespace: "A.B",
        }));

        expect(output).toMatchInlineSnapshot(`
            "var variable: C.InternalType;
            "
        `);
    });
});
