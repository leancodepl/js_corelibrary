import type { ApiDateTimeOffset } from "@leancodepl/api-date";
import { parse } from "date-fns";

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset): Date;
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset | undefined): Date | undefined;
export function fromApiDateTimeOffset(dateTimeOffset: ApiDateTimeOffset | undefined): Date | undefined {
    if (!dateTimeOffset) {
        return undefined;
    }

    return parse(dateTimeOffset as any, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date());
}
