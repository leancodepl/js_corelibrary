import { assertNotEmpty } from "./assertNotEmpty";

export function ensureNotEmpty<T>(value: T | null | undefined, message?: string): T {
    assertNotEmpty(value, message);

    return value;
}
