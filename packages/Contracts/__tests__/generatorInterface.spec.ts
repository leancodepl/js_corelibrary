import { join } from "path";
import ts from "typescript";
import generateContracts from "../src";
import { GeneratorContext } from "../src/typesGeneration";
import GeneratorInterface from "../src/typesGeneration/GeneratorInterface";

describe("handleValidationErrors", () => {
    it("does not call any validation handler if there are no errors", async () => {
        const generator = new GeneratorInterface({
            statement: {
                name: "Abc",
                dto: {},
                comment: "asd",
            },
            typesDictionary: {
                interfaces: {},
            },
        });

        const printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed,
        });

        const baseContext: GeneratorContext = {
            printNode: node =>
                printer.printNode(
                    ts.EmitHint.Unspecified,
                    node,
                    ts.factory.createSourceFile(
                        [],
                        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
                        ts.NodeFlags.Synthesized,
                    ),
                ),
        };

        const out = generator.generateStatements(baseContext);

        const typesOutput = printer.printFile(
            ts.factory.createSourceFile(
                out,
                ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
                ts.NodeFlags.Synthesized,
            ),
        );

        expect(typesOutput).toMatchInlineSnapshot(`
            "/**
             * asd
             */
            export interface Abc {
                abc: number
            }
            "
        `);
    });
});
