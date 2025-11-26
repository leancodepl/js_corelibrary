import { assertNotEmpty } from "./assertNotEmpty"

/**
 * Ensures that a value is not null or undefined, returning it if valid or throwing an error if empty.
 *
 * @template T - The type of the value being checked
 * @param value - The value to ensure is not null or undefined
 * @param message - Optional error message to use if the value is null or undefined
 * @returns The value if it is not null or undefined
 * @throws {Error} When the value is null or undefined
 * @example
 * ```typescript
 * function processOptionalData(data?: string | null) {
 *   const validData = ensureNotEmpty(data);
 *   return validData.toUpperCase(); // validData is guaranteed to be not null/undefined
 * }
 * ```
 */
export function ensureNotEmpty<T>(value: null | T | undefined, message?: string): T {
  assertNotEmpty(value, message)

  return value
}
