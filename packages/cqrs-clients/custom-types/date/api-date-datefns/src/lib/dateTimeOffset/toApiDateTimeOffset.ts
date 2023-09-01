import type { ApiDateTimeOffset } from "@leancodepl/api-date";
import { format } from "date-fns";

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiDateTimeOffset(dateTimeOffset: Date): ApiDateTimeOffset;
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined;
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined {
    if (!dateTimeOffset) {
        return undefined;
    }

    return format(dateTimeOffset, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") as any;
}
