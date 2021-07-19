import { leancode } from "../src/protocol";
import GeneratorInterface from "../src/typesGeneration/GeneratorInterface";
import { mkTypesDictionary, printStatement } from "./testUtils";

const typesDictionary = mkTypesDictionary([]);

describe("GeneratorInterface", () => {
    it("prints empty interface", () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "Interface",
            },
            typesDictionary,
        });

        const output = printStatement(generator);

        expect(output).toMatchInlineSnapshot(`
            "export interface Interface {
            }
            "
        `);
    });

    it("prints interface with a comment", () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "Interface",
                comment: "This is an example comment",
            },
            typesDictionary,
        });

        const output = printStatement(generator);

        expect(output).toMatchInlineSnapshot(`
            "/**
             * This is an example comment
             */
            export interface Interface {
            }
            "
        `);
    });

    it("prints deprecated comment when interface is obsolete", () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "Interface",
                attributes: [{ attributeName: "System.ObsoleteAttribute" }],
            },
            typesDictionary,
        });

        const output = printStatement(generator);

        expect(output).toMatchInlineSnapshot(`
            "/**
             * @deprecated
             */
            export interface Interface {
            }
            "
        `);
    });

    it("prints interface with basic properties", () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "Interface",
                properties: [
                    {
                        name: "numberProperty",
                        type: {
                            known: {
                                type: leancode.contracts.KnownType.UInt32,
                            },
                        },
                    },
                    {
                        name: "stringProperty",
                        type: {
                            known: {
                                type: leancode.contracts.KnownType.String,
                            },
                        },
                    },
                ],
            },
            typesDictionary,
        });

        const output = printStatement(generator);

        expect(output).toMatchInlineSnapshot(`
            "export interface Interface {
                numberProperty: number;
                stringProperty: string;
            }
            "
        `);
    });
});
