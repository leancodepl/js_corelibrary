export function assertNotEmpty<T>(value: T | undefined | null): asserts value is T {
    console.assert(value !== undefined && value !== undefined);
}

export function ensureNotEmpty<T>(value: T | undefined | null) {
    assertNotEmpty(value);

    return value;
}
