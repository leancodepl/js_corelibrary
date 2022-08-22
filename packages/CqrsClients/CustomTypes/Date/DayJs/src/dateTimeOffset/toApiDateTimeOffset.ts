import { ApiDateTimeOffset } from "@leancode/api-date";
import { Dayjs } from "dayjs";

//dayjs handles at most milliseconds precision, smaller units are lost in conversion process
export function toApiDateTimeOffset(time: Dayjs): ApiDateTimeOffset;
export function toApiDateTimeOffset(time: Dayjs | undefined): ApiDateTimeOffset | undefined;
export function toApiDateTimeOffset(time: Dayjs | undefined): ApiDateTimeOffset | undefined {
    if (!time) {
        return undefined;
    }

    return time.format("YYYY-MM-DD HH:mm:ss.SSS Z") as any;
}

export default toApiDateTimeOffset;
