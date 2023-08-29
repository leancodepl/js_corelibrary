import { toUpperFirst, toLowerFirst } from "./transformFirst";
import { CapitalizeDeep, TransformDeep, Mode, UncapitalizeDeep } from "./types";

function transformDeep<T, TMode extends Mode>(value: T, mode: Mode): TransformDeep<T, TMode> {
    if (value === null || value === undefined) {
        return undefined as TransformDeep<T, TMode>;
    }

    if (Array.isArray(value)) {
        return value.map(val => transformDeep(val, mode)) as TransformDeep<T, TMode>;
    }

    if (typeof value === "object") {
        const transformKey = mode === "capitalize" ? toUpperFirst : toLowerFirst;

        return Object.entries(value).reduce(
            (accumulator, [key, value]) => ({ ...accumulator, [transformKey(key)]: transformDeep(value, mode) }),
            {} as TransformDeep<T, TMode>,
        );
    }

    return value as TransformDeep<T, TMode>;
}

export function uncapitalizeDeep<T>(value: T): UncapitalizeDeep<T> {
    return transformDeep(value, "uncapitalize");
}

export function capitalizeDeep<T>(value: T): CapitalizeDeep<T> {
    return transformDeep(value, "capitalize");
}
