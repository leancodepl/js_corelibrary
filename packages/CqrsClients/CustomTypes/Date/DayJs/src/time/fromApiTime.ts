import { ApiTimeOnly } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

//dayjs handles at most milliseconds precision, smaller units are lost in conversion process
export function fromApiTime(time: ApiTimeOnly): Dayjs;
export function fromApiTime(time: undefined): undefined;
export function fromApiTime(time?: ApiTimeOnly): Dayjs | undefined {
    const apiTime = time as any;

    if (!apiTime) {
        return undefined;
    }

    return dayjs(apiTime, "HH:mm:ss.SSS");
}

export default fromApiTime;
