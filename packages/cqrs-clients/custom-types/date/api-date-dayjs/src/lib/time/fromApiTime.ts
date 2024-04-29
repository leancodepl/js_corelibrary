import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ApiTimeOnly } from "@leancodepl/api-date";

dayjs.extend(customParseFormat);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiTime(time: ApiTimeOnly): dayjs.Dayjs;
export function fromApiTime(time: ApiTimeOnly | undefined): dayjs.Dayjs | undefined;
export function fromApiTime(time: ApiTimeOnly | undefined): dayjs.Dayjs | undefined {
    if (!time) {
        return undefined;
    }

    return dayjs(time as any, "HH:mm:ss.SSS");
}
