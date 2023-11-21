import { isObject, isString } from "lodash";

export function getNodeInputType(attr: unknown): string {
    return isObject(attr) && "type" in attr && isString(attr.type) ? attr.type : "";
}
