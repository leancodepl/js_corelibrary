import { assertNotNull } from "./assertNotNull";

export function ensureNotNull<T>(value: T | null, message?: string): T {
    assertNotNull(value, message);

    return value;
}
