import { ApiTimeOnly } from "@leancode/api-date";
import { parse } from "date-fns";

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiTime(time: ApiTimeOnly): Date;
export function fromApiTime(time: ApiTimeOnly | undefined): Date | undefined;
export function fromApiTime(time: ApiTimeOnly | undefined): Date | undefined {
    const apiTime = time as any;

    if (!apiTime) {
        return undefined;
    }

    return parse(apiTime, "HH:mm:ss.SSS", new Date());
}

export default fromApiTime;
