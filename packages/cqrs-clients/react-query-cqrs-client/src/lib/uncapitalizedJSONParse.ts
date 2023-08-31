import { toLowerFirst } from "@leancodepl/utils";

export function uncapitalizedJSONParse(json: string) {
    return JSON.parse(json, (key, value: unknown) => {
        if (
            (value === null && key === "") ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            Array.isArray(value)
        )
            return value;

        if (!value) {
            return undefined;
        }

        return Object.fromEntries(Object.entries(value).map(([key, value]) => [toLowerFirst(key), value ?? undefined]));
    });
}
