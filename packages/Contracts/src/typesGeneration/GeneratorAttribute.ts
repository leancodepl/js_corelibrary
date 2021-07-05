import ts from "typescript";
import { leancode } from "../protocol";
import { ensureNotEmpty } from "../utils/notEmpty";

export default class GeneratorAttribute {
    name;

    private static tagName = ts.factory.createIdentifier("attribute");

    constructor({ attribute }: { attribute: leancode.contracts.IAttributeRef }) {
        const name = ensureNotEmpty(attribute.attributeName);
        this.name = name;
    }

    generateAttribute(): ts.JSDocTag {
        if (this.name === "System.ObsoleteAttribute") {
            return ts.factory.createJSDocUnknownTag(ts.factory.createIdentifier("deprecated"));
        }

        return ts.factory.createJSDocUnknownTag(GeneratorAttribute.tagName, this.name);
    }
}
