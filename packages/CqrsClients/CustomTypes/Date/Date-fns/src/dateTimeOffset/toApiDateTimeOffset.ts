import { ApiDateTimeOffset } from "@leancode/api-date";
import { format } from "date-fns";

//this function handles at most milliseconds precision, smaller units are lost in conversion process
export function toApiDateTimeOffset(dateTimeOffset: Date): ApiDateTimeOffset;
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined;
export function toApiDateTimeOffset(dateTimeOffset: Date | undefined): ApiDateTimeOffset | undefined {
    if (!dateTimeOffset) {
        return undefined;
    }

    return format(dateTimeOffset, "yyyy-MM-dd HH:mm:ss.SSS XXX") as any;
}

export default toApiDateTimeOffset;
