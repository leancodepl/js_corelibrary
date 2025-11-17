import invariant from "tiny-invariant"

/**
 * Asserts that a value is not undefined. Throws an error if the value is undefined.
 * This is a type assertion function that narrows the type to exclude undefined.
 *
 * @template T - The type of the value being checked
 * @param value - The value to check for undefined
 * @param message - Optional error message to use if assertion fails
 * @throws {Error} When the value is undefined
 * @example
 * ```typescript
 * function processUser(user?: User) {
 *   assertDefined(user);
 *   return user.name; // TypeScript knows user is defined
 * }
 * ```
 */
export function assertDefined<T>(value: T | undefined, message?: string): asserts value is T {
  invariant(value !== undefined, message)
}
