export function getNodeInputType(attr: unknown): string {
    return attr && typeof attr === "object" && "type" in attr && attr.type && typeof attr.type === "string"
        ? attr.type
        : ""
}
