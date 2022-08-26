import { ApiTimeOnly } from "@leancode/api-date";
import { Dayjs } from "dayjs";

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiTime(time: Dayjs): ApiTimeOnly;
export function toApiTime(time: Dayjs | undefined): ApiTimeOnly | undefined;
export function toApiTime(time: Dayjs | undefined): ApiTimeOnly | undefined {
    if (!time) {
        return undefined;
    }

    return time.format("HH:mm:ss.SSS") as any;
}

export default toApiTime;
