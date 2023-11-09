import invariant from "tiny-invariant";

export function assertNotNull<T>(value: T | null, message?: string): asserts value is T {
    invariant(value !== null, message);
}
