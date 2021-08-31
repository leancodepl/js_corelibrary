import { groupBy } from "lodash";
import ts from "typescript";
import { ImportReference } from "../typesGeneration/GeneratorContext";
import resolveImport from "../utils/resolveImport";

export default function getReferencedImportsPreamble({
    baseDir,
    referencedImports,
    fileLocation,
}: {
    baseDir: string;
    fileLocation: string;
    referencedImports: ImportReference[];
}): ts.Statement[] {
    const importsByType = groupBy(referencedImports, ref => ("path" in ref.from ? "path" : "lib"));
    const libImportsByName = groupBy(importsByType["lib"], ref => "lib" in ref.from && ref.from.lib);
    const pathImportsByPath = groupBy(importsByType["path"], ref => "path" in ref.from && ref.from.path);

    const libsStatements = Object.entries(libImportsByName).map(([name, libs]) => {
        const libsByName = groupBy(libs, lib => lib.name);

        const defaultImport = Object.values(libsByName).find(l =>
            l.some(l => l.export && "default" in l.export && l.export.default),
        )?.[0];

        return ts.factory.createImportDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* importClause */ ts.factory.createImportClause(
                /* isTypeOnly */ true,
                /* name */ defaultImport ? ts.factory.createIdentifier(defaultImport.name) : undefined,
                /* namedBinding */ ts.factory.createNamedImports(
                    /* elements */ Object.entries(libsByName).map(([name, [{ export: exportData }]]) =>
                        ts.factory.createImportSpecifier(
                            /* propertyName */ exportData && "name" in exportData
                                ? ts.factory.createIdentifier(exportData.name)
                                : undefined,
                            /* name */ ts.factory.createIdentifier(name),
                        ),
                    ),
                ),
            ),
            /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ name, /* isSingleQuote */ false),
        );
    });

    const pathStatements = Object.entries(pathImportsByPath).map(([path, libs]) => {
        const libsByName = groupBy(libs, lib => lib.name);

        const defaultImport = Object.values(libsByName).find(l =>
            l.some(l => l.export && "default" in l.export && l.export.default),
        )?.[0];

        const importPath = resolveImport({
            location: path,
            fileLocation,
            baseDir,
        });

        return ts.factory.createImportDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* importClause */ ts.factory.createImportClause(
                /* isTypeOnly */ true,
                /* name */ defaultImport ? ts.factory.createIdentifier(defaultImport.name) : undefined,
                /* namedBinding */ ts.factory.createNamedImports(
                    /* elements */ Object.entries(libsByName).map(([name, [{ export: exportData }]]) =>
                        ts.factory.createImportSpecifier(
                            /* propertyName */ exportData && "name" in exportData
                                ? ts.factory.createIdentifier(exportData.name)
                                : undefined,
                            /* name */ ts.factory.createIdentifier(name),
                        ),
                    ),
                ),
            ),
            /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
        );
    });

    return [...libsStatements, ...pathStatements];
}
