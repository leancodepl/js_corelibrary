import { parse } from "date-fns"
import type { ApiDateTimeOffset } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset): Date
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset | undefined): Date | undefined
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset | undefined): Date | undefined {
    if (!dateTimeOffset) {
        return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parse(dateTimeOffset as any, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date())
}
