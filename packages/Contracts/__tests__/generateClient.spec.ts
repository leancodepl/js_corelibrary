import { leancode } from "../src/protocol";
import { GeneratorQuery } from "../src/typesGeneration";
import { mkTypesDictionary, printClient } from "./testUtils";

describe("generateClient", () => {
    it("prints query that returns string correctly", () => {
        const typesDictionary = mkTypesDictionary(["TestQuery"]);
        const generator = new GeneratorQuery({
            typesDictionary,
            statement: {
                name: "TestQuery",
                query: {
                    returnType: {
                        known: {
                            type: leancode.contracts.KnownType.String,
                        },
                    },
                },
            },
        });

        const output = printClient(generator);

        expect(output).toMatchInlineSnapshot(`
            "export default function (cqrsClient: CQRS) {
                return {
                    TestQuery: cqrsClient.createQuery<TestQuery, string>(\\"TestQuery\\")
                };
            }
            "
        `);
    });

    it("prints query that returns nullable string correctly", () => {
        const typesDictionary = mkTypesDictionary(["TestQuery"]);
        const generator = new GeneratorQuery({
            typesDictionary,
            statement: {
                name: "TestQuery",
                query: {
                    returnType: {
                        known: {
                            type: leancode.contracts.KnownType.String,
                        },
                        nullable: true,
                    },
                },
            },
        });

        const output = printClient(generator);

        expect(output).toMatchInlineSnapshot(`
            "export default function (cqrsClient: CQRS) {
                return {
                    TestQuery: cqrsClient.createQuery<TestQuery, string | null | undefined>(\\"TestQuery\\")
                };
            }
            "
        `);
    });
});
