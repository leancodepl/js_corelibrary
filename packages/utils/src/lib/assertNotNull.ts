import invariant from "tiny-invariant"

/**
 * Asserts that a value is not null. Throws an error if the value is null.
 * This is a type assertion function that narrows the type to exclude null.
 *
 * @template T - The type of the value being checked
 * @param value - The value to check for null
 * @param message - Optional error message to use if assertion fails
 * @throws {Error} When the value is null
 * @example
 * ```typescript
 * function processData(data: string | null) {
 *   assertNotNull(data);
 *   return data.toUpperCase(); // TypeScript knows data is not null
 * }
 * ```
 */
export function assertNotNull<T>(value: T | null, message?: string): asserts value is T {
  invariant(value !== null, message)
}
