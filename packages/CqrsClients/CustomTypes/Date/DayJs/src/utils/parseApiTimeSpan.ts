import { ApiTimeSpan } from "@leancode/api-date";

const parseIntMatched = (value: string | undefined) => parseInt(value ?? "0");

export default function parseApiTimeSpan(timespan: ApiTimeSpan) {
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
