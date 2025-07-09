import { assertDefined } from "./assertDefined";

/**
 * Ensures that a value is defined, returning it if defined or throwing an error if undefined.
 * 
 * @template T - The type of the value being checked
 * @param value - The value to ensure is defined
 * @param message - Optional error message to use if the value is undefined
 * @returns The value if it is defined
 * @throws {Error} When the value is undefined
 * @example
 * ```typescript
 * function processUser(user?: User) {
 *   const definedUser = ensureDefined(user);
 *   return definedUser.name; // definedUser is guaranteed to be defined
 * }
 * ```
 */
export function ensureDefined<T>(value: T | undefined, message?: string): T {
    assertDefined(value, message);

    return value;
}
