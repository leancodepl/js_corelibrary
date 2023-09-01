import type { ApiTimeSpan } from "@leancodepl/api-date";
import { parseApiTimeSpan } from "@leancodepl/api-date-utils";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiTimeSpan(timeSpan: ApiTimeSpan): duration.Duration;
export function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): duration.Duration | undefined;
export function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): duration.Duration | undefined {
    if (!timeSpan) {
        return undefined;
    }

    const parsedDuration = parseApiTimeSpan(timeSpan);

    const isNegative = parsedDuration.sign === "-";

    const dayjsDuration = dayjs.duration(parsedDuration.values);

    if (isNegative) {
        return dayjs.duration(-dayjsDuration.asMilliseconds());
    }

    return dayjsDuration;
}
