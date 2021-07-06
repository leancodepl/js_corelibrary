import { leancode } from "../src/protocol";
import GeneratorKnownType from "../src/typesGeneration/types/GeneratorKnownType";
import { printType, typesDictionary } from "./testUtils";

const KnownType = leancode.contracts.KnownType;

describe("GeneratorKnownType", () => {
    it("prints uint32 type correctly", () => {
        const generator = new GeneratorKnownType({
            known: {
                type: KnownType.UInt32,
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: number;
            "
        `);
    });

    it("prints string type correctly", () => {
        const generator = new GeneratorKnownType({
            known: {
                type: KnownType.String,
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: string;
            "
        `);
    });

    it("prints date time type correctly", () => {
        const generator = new GeneratorKnownType({
            known: {
                type: KnownType.DateTime,
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: string;
            "
        `);
    });

    it("prints array type correctly", () => {
        const generator = new GeneratorKnownType({
            known: {
                arguments: [
                    {
                        known: {
                            type: KnownType.String,
                        },
                    },
                ],
                type: KnownType.Array,
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: string[];
            "
        `);
    });

    it("prints map type correctly", () => {
        const generator = new GeneratorKnownType({
            known: {
                arguments: [
                    {
                        known: {
                            type: KnownType.String,
                        },
                    },
                    {
                        known: {
                            type: KnownType.Boolean,
                        },
                    },
                ],
                type: KnownType.Map,
            },
            typesDictionary,
        });

        const output = printType(generator);

        expect(output).toMatchInlineSnapshot(`
            "var variable: {
                [key in string]: number;
            };
            "
        `);
    });
});
