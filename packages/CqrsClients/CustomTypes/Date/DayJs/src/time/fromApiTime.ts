import { ApiTimeOnly } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Options = { isUtc?: boolean };

//dayjs handles at most milliseconds precision, smaller units are lost in conversion process
export function fromApiTime(time: ApiTimeOnly, options?: Options): Dayjs;
export function fromApiTime(time: undefined, options?: Options): undefined;
export function fromApiTime(time?: ApiTimeOnly, options?: Options): Dayjs | undefined {
    const apiTime = time as any;

    if (!apiTime) {
        return undefined;
    }

    if (options?.isUtc) {
        return dayjs.utc(apiTime, "HH:mm:ss").local();
    }

    return dayjs(apiTime, "HH:mm:ss");
}

export default fromApiTime;
