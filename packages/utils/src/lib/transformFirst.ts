function transformFirst(value: string, transformFn: (value: string) => string) {
    if (value.length === 0) {
        return ""
    }

    return transformFn(value[0]) + value.slice(1)
}

/**
 * Converts the first character of a string to lowercase.
 *
 * @param value - The string to transform
 * @returns The string with the first character in lowercase
 * @example
 * ```typescript
 * const result = toLowerFirst('UserName');
 * // Result: 'userName'
 * ```
 */
export function toLowerFirst(value: string) {
    return transformFirst(value, value => value.toLowerCase())
}

/**
 * Converts the first character of a string to uppercase.
 *
 * @param value - The string to transform
 * @returns The string with the first character in uppercase
 * @example
 * ```typescript
 * const result = toUpperFirst('userName');
 * // Result: 'UserName'
 * ```
 */
export function toUpperFirst<TValue extends string>(value: TValue) {
    return transformFirst(value, value => value.toUpperCase()) as Capitalize<TValue>
}
