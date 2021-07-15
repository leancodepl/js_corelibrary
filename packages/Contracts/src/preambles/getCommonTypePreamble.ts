import ts from "typescript";
import { CommonTypesConfiguration } from "../types";
import resolveImport from "../utils/resolveImport";

export default function getCommonTypePreamble({
    baseDir,
    fileLocation,
    isTypeOnly = false,
    typeName,
    commonTypeConfiguration,
}: {
    baseDir: string;
    fileLocation: string;
    isTypeOnly?: boolean;
    typeName: string;
    commonTypeConfiguration: CommonTypesConfiguration;
}) {
    const { location, exportName } = (() => {
        if (typeof commonTypeConfiguration === "string") {
            return {
                location: commonTypeConfiguration,
                exportName: undefined,
            };
        }
        return commonTypeConfiguration;
    })();

    const importPath = resolveImport({
        location,
        fileLocation,
        baseDir,
    });

    let importClause;

    if (exportName) {
        importClause = ts.factory.createImportClause(
            /* isTypeOnly */ isTypeOnly,
            /* name */ undefined,
            /* namedBinding */ ts.factory.createNamedImports(
                /* elements */ [
                    ts.factory.createImportSpecifier(
                        /* propertyName */ ts.factory.createIdentifier(exportName),
                        /* name */ ts.factory.createIdentifier(typeName),
                    ),
                ],
            ),
        );
    } else {
        importClause = ts.factory.createImportClause(
            /* isTypeOnly */ isTypeOnly,
            /* name */ ts.factory.createIdentifier(typeName),
            /* namedBinding */ undefined,
        );
    }

    return ts.factory.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined,
        /* importClause */ importClause,
        /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
    );
}
