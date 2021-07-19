import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import prependJsDoc from "./prependJsDoc";
import GeneratorNumberValue from "./values/GeneratorNumberValue";

export default class GeneratorEnumMember {
    name;
    comment;
    value;

    constructor(member: leancode.contracts.IEnumValue) {
        const name = ensureNotEmpty(member.name);
        const value = new GeneratorNumberValue({ numberOrFloat: member });

        this.name = name;
        this.comment = member.comment ?? undefined;
        this.value = value;
    }

    generateEnumMember(context: GeneratorContext) {
        const constantStatement = ts.factory.createEnumMember(this.name, this.value.generateValue());

        if (this.comment) {
            const jsDocComment = ts.factory.createJSDocComment(this.comment);

            return prependJsDoc({
                jsDocComment,
                node: constantStatement,
                context,
            });
        }

        return constantStatement;
    }
}
