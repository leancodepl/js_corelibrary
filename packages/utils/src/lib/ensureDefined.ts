import { assertDefined } from "./assertDefined";

export function ensureDefined<T>(value: T | undefined, message?: string): T {
    assertDefined(value, message);

    return value;
}
