import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import GeneratorEnumMember from "./GeneratorEnumMember";
import GeneratorStatement from "./GeneratorStatement";
import prependJsDoc from "./prependJsDoc";

export default class GeneratorEnum implements GeneratorStatement {
    id;
    fullName;
    name;
    members;
    comment;

    constructor({
        statement,
        nameTransform,
    }: {
        statement: leancode.contracts.IStatement;
        nameTransform?: (name: string) => string;
    }) {
        const id = ensureNotEmpty(statement.name);
        const fullName = nameTransform?.(id) ?? id;
        const name = GeneratorEnum.getNameFromFullName(fullName);
        const members = statement.enum?.members?.map(member => new GeneratorEnumMember(member)) ?? [];

        this.id = id;
        this.fullName = fullName;
        this.name = name;
        this.members = members;
        this.comment = statement.comment ?? undefined;
    }

    generateStatements(context: GeneratorContext) {
        const enumStatement = ts.factory.createEnumDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            /* name */ this.name,
            /* members */ this.members.map(m => m.generateEnumMember(context)),
        );

        if (this.comment) {
            const jsDocComment = ts.factory.createJSDocComment(this.comment);

            return [
                prependJsDoc({
                    jsDocComment,
                    node: enumStatement,
                    context,
                }),
            ];
        }

        return [enumStatement];
    }

    generateClient() {
        return [];
    }

    private static getNameFromFullName(name: string) {
        const parts = name.split(".");

        return parts[parts.length - 1];
    }
}
