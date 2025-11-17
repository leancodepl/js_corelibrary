type PrefixWith<T, TPrefix extends string> = { [K in keyof T as K extends string ? `${TPrefix}${K}` : never]: T[K] }

/**
 * Adds a prefix to all keys in an object, creating a new object with prefixed keys.
 *
 * @template T - The type of the input object
 * @template TPrefix - The type of the prefix string
 * @param object - The object whose keys will be prefixed
 * @param prefix - The prefix string to add to each key
 * @returns A new object with all keys prefixed
 * @example
 * ```typescript
 * const apiData = { userId: 1, userName: 'John' };
 * const prefixed = addPrefix(apiData, 'api_');
 * // Result: { api_userId: 1, api_userName: 'John' }
 * ```
 */
export function addPrefix<T extends object, TPrefix extends string>(object: T, prefix: TPrefix) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [`${prefix}${key}`, value])) as PrefixWith<
    T,
    TPrefix
  >
}
