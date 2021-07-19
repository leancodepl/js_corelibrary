import ts from "typescript";
import { CustomTypesConfiguration } from "../types";
import resolveImport from "../utils/resolveImport";

export default function getCustomTypesPreamble({
    baseDir,
    isTypeOnly = false,
    fileLocation,
    customTypes = {},
}: {
    baseDir: string;
    isTypeOnly?: boolean;
    fileLocation: string;
    customTypes?: CustomTypesConfiguration;
}): ts.Statement[] {
    return Object.entries(customTypes).map(([, { location, name, exportName }]) => {
        const importPath = resolveImport({
            location,
            fileLocation,
            baseDir,
        });

        return ts.factory.createImportDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* importClause */ ts.factory.createImportClause(
                /* isTypeOnly */ isTypeOnly,
                /* name */ undefined,
                /* namedBinding */ ts.factory.createNamedImports(
                    /* elements */ [
                        ts.factory.createImportSpecifier(
                            /* propertyName */ exportName ? ts.factory.createIdentifier(exportName) : undefined,
                            /* name */ ts.factory.createIdentifier(name),
                        ),
                    ],
                ),
            ),
            /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
        );
    });
}
