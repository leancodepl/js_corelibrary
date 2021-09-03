import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";
import GeneratorContext from "./GeneratorContext";
import prependJsDoc from "./prependJsDoc";
import GeneratorValueFactory from "./values/GeneratorValueFactory";

export default class GeneratorConstant {
    name;
    comment;
    value;

    constructor(constant: leancode.contracts.IConstantRef) {
        const name = ensureNotEmpty(constant.name);
        const value = GeneratorValueFactory.createValue(ensureNotEmpty(constant.value));

        this.name = name;
        this.comment = constant.comment ?? undefined;
        this.value = value;
    }

    generateConstant(context: GeneratorContext): ts.ObjectLiteralElementLike {
        const constantStatement = ts.factory.createPropertyAssignment(this.name, this.value.generateValue());

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

    generateValue(context: GeneratorContext) {
        const constantValue = this.value.generateValue();

        if (this.comment) {
            const jsDocComment = ts.factory.createJSDocComment(this.comment);

            return prependJsDoc({
                jsDocComment,
                node: constantValue,
                context,
            });
        }

        return constantValue;
    }
}
