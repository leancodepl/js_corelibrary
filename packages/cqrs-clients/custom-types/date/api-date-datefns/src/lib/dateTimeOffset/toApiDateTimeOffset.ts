import { format } from "date-fns"
import type { ApiDateTimeOffset } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiDateTimeOffset(dateTimeOffset: Date): ApiDateTimeOffset
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined {
    if (!dateTimeOffset) {
        return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return format(dateTimeOffset, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") as any
}
