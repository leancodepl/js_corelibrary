import { ApiTimeOnly } from "@leancode/api-date";
import { Dayjs } from "dayjs";

type Options = { toUtc?: boolean };

//dayjs handles at most milliseconds precision, smaller units are lost in conversion process
export function toApiTime(time: Dayjs, options?: Options): ApiTimeOnly;
export function toApiTime(time: undefined, options?: Options): undefined;
export function toApiTime(time?: Dayjs, options?: Options): ApiTimeOnly | undefined {
    if (!time) {
        return undefined;
    }

    const adjustedTime = options?.toUtc ? time.utc() : time;

    return `${adjustedTime.format("HH:mm:ss.SSS")}` as any;
}

export default toApiTime;
