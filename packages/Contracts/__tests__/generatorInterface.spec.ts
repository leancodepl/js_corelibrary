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
                dto: {
                    typeDescriptor: {
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
                },
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

    it("prints interface with constants", () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "ConstInterface",
                dto: {
                    typeDescriptor: {
                        constants: [
                            {
                                name: "numberConstant",
                                value: {
                                    number: {
                                        value: 42,
                                    },
                                },
                            },
                            {
                                name: "booleanConstant",
                                value: {
                                    bool: {
                                        value: true,
                                    },
                                },
                            },
                            {
                                name: "floatConstant",
                                value: {
                                    floatingPoint: {
                                        value: 12.5,
                                    },
                                },
                            },
                            {
                                name: "nullConstant",
                                value: {
                                    null: {},
                                },
                            },
                            {
                                name: "stringConstant",
                                value: {
                                    string: { value: "hello world" },
                                },
                            },
                        ],
                    },
                },
            },
            typesDictionary,
        });

        const output = printStatement(generator);

        expect(output).toMatchInlineSnapshot(`
            "export interface ConstInterface {
            }
            export namespace ConstInterface {
                export const numberConstant = 42;
                export const booleanConstant = true;
                export const floatConstant = 12.5;
                export const nullConstant = null;
                export const stringConstant = \\"hello world\\";
            }
            "
        `);
    });
});
