import { isNil, isString } from "lodash";

export function getNodeInputType(attr: unknown): string {
    if (typeof attr === "object" && !isNil(attr) && "type" in attr && isString(attr.type)) {
        return attr.type;
    }
    return "";
}
