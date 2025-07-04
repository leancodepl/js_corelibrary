import { toLowerFirst, toUpperFirst } from "./transformFirst"
import { CapitalizeDeep, Mode, TransformDeep, UncapitalizeDeep } from "./types"

function transformDeep<T, TMode extends Mode>(value: T, mode: Mode): TransformDeep<T, TMode> {
    if (value === null || value === undefined) {
        return undefined as TransformDeep<T, TMode>
    }

    if (Array.isArray(value)) {
        return value.map(val => transformDeep(val, mode)) as TransformDeep<T, TMode>
    }

    if (typeof value === "object") {
        const transformKey = mode === "capitalize" ? toUpperFirst : toLowerFirst

        return Object.entries(value).reduce(
            (accumulator, [key, value]) => ({ ...accumulator, [transformKey(key)]: transformDeep(value, mode) }),
            {} as TransformDeep<T, TMode>,
        )
    }

    return value as TransformDeep<T, TMode>
}

/**
 * Recursively transforms all object keys to use uncapitalized (camelCase) format.
 * 
 * @template T - The type of the input value
 * @param value - The value to transform (can be object, array, or primitive)
 * @returns A new object with all keys converted to camelCase
 * @example
 * ```typescript
 * const serverData = { UserId: 1, UserName: 'John', Profile: { FirstName: 'John' } };
 * const clientData = uncapitalizeDeep(serverData);
 * // Result: { userId: 1, userName: 'John', profile: { firstName: 'John' } }
 * ```
 */
export function uncapitalizeDeep<T>(value: T): UncapitalizeDeep<T> {
    return transformDeep(value, "uncapitalize")
}

/**
 * Recursively transforms all object keys to use capitalized (PascalCase) format.
 * 
 * @template T - The type of the input value
 * @param value - The value to transform (can be object, array, or primitive)
 * @returns A new object with all keys converted to PascalCase
 * @example
 * ```typescript
 * const clientData = { userId: 1, userName: 'John', profile: { firstName: 'John' } };
 * const serverData = capitalizeDeep(clientData);
 * // Result: { UserId: 1, UserName: 'John', Profile: { FirstName: 'John' } }
 * ```
 */
export function capitalizeDeep<T>(value: T): CapitalizeDeep<T> {
    return transformDeep(value, "capitalize")
}
