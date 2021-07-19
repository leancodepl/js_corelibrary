import ts from "typescript";
import GeneratorInternalType from "../typesGeneration/types/GeneratorInternalType";
import extractMinimalReferenceTypeName from "../utils/extractMinimalReferenceTypeName";
import resolveImport from "../utils/resolveImport";

export default function getReferencedInternalTypesPreamble({
    referencedInternalTypes,
    baseDir,
    fileLocation,
    typesFilename,
    baseNamespace,
}: {
    referencedInternalTypes: Set<GeneratorInternalType>;
    baseDir: string;
    fileLocation: string;
    typesFilename: string;
    baseNamespace?: string;
}) {
    const importPath = resolveImport({
        location: typesFilename,
        fileLocation,
        baseDir,
    });

    const referencedInternalTypesToImport = [
        ...new Set(
            [...referencedInternalTypes.values()].map(
                internalType =>
                    extractMinimalReferenceTypeName(internalType.relatedInterface.fullName, baseNamespace).split(
                        ".",
                    )[0],
            ),
        ).values(),
    ];

    return ts.factory.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined,
        /* importClause */ ts.factory.createImportClause(
            /* isTypeOnly */ false,
            /* name */ undefined,
            /* namedBinding */ ts.factory.createNamedImports(
                /* elements */ referencedInternalTypesToImport.map(typeToImport =>
                    ts.factory.createImportSpecifier(
                        /* propertyName */ undefined,
                        /* name */ ts.factory.createIdentifier(typeToImport),
                    ),
                ),
            ),
        ),
        /* moduleSpecifier */ ts.factory.createStringLiteral(/* text */ importPath, /* isSingleQuote */ false),
    );
}
