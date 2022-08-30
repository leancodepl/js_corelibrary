import { ApiTimeOnly } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiTime(time: ApiTimeOnly): Dayjs;
export function fromApiTime(time: ApiTimeOnly | undefined): Dayjs | undefined;
export function fromApiTime(time: ApiTimeOnly | undefined): Dayjs | undefined {
    if (!time) {
        return undefined;
    }

    return dayjs(time as any, "HH:mm:ss.SSS");
}

export default fromApiTime;
