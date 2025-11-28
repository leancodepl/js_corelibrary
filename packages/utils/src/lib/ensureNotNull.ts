import { assertNotNull } from "./assertNotNull"

/**
 * Ensures that a value is not null, returning it if not null or throwing an error if null.
 * Unlike assertNotNull, this function returns the value for use in expressions.
 *
 * @template T - The type of the value being checked
 * @param value - The value to ensure is not null
 * @param message - Optional error message to use if the value is null
 * @returns The value if it is not null
 * @throws {Error} When the value is null
 * @example
 * ```typescript
 * function processData(data: string | null) {
 *   const nonNullData = ensureNotNull(data);
 *   return nonNullData.toUpperCase(); // nonNullData is guaranteed to be not null
 * }
 * ```
 */
export function ensureNotNull<T>(value: T | null, message?: string): T {
  assertNotNull(value, message)

  return value
}
