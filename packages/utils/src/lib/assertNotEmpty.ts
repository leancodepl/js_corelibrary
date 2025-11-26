import invariant from "tiny-invariant"

/**
 * Asserts that a value is not null or undefined. Throws an error if the value is null or undefined.
 * This is a type assertion function that narrows the type to exclude null and undefined.
 *
 * @template T - The type of the value being checked
 * @param value - The value to check for null or undefined
 * @param message - Optional error message to use if assertion fails
 * @throws {Error} When the value is null or undefined
 * @example
 * ```typescript
 * function processOptionalData(data?: string | null) {
 *   assertNotEmpty(data);
 *   return data.toUpperCase(); // TypeScript knows data is not null/undefined
 * }
 * ```
 */
export function assertNotEmpty<T>(value: null | T | undefined, message?: string): asserts value is T {
  invariant(value !== null && value !== undefined, message)
}
