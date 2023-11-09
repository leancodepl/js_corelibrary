import invariant from "tiny-invariant";

export function assertDefined<T>(value: T | undefined, message?: string): asserts value is T {
    invariant(value !== undefined, message);
}
