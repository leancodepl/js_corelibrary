import invariant from "tiny-invariant"

export function assertNotEmpty<T>(value: T | null | undefined, message?: string): asserts value is T {
    invariant(value !== null && value !== undefined, message)
}
