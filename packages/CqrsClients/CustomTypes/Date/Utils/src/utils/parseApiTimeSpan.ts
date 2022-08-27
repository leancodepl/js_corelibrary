import { ApiTimeSpan } from "@leancode/api-date";

const parseIntMatched = (value: string | undefined) => parseInt(value ?? "0");

export default function parseApiTimeSpan(timespan: ApiTimeSpan) {
    /**
     * This regex returns tuple of matched strings (either of string type or undefined) and default match function parameters
     * following [timeSpan, sign, days, hours, minutes, seconds, milliseconds, index of search at which the result was found, input (search string), groups] schema
     */
    const matched = (timespan as any).match(/^(-)?([0-9]+)?\.?([0-9]{2}):([0-9]{2}):([0-9]{2})\.?([0-9]{3})?$/);

    return {
        sign: matched?.[1],
        values: {
            days: parseIntMatched(matched?.[2]),
            hours: parseIntMatched(matched?.[3]),
            minutes: parseIntMatched(matched?.[4]),
            seconds: parseIntMatched(matched?.[5]),
            milliseconds: parseIntMatched(matched?.[6]),
        },
    };
}
