import { ApiDateTimeOffset } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset): Dayjs;
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset | undefined): Dayjs | undefined;
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset | undefined): Dayjs | undefined {
    if (!datetime) {
        return undefined;
    }

    return dayjs(datetime as any, "YYYY-MM-DDTHH:mm:ss.SSSZ");
}

export default fromApiDateTimeOffset;
