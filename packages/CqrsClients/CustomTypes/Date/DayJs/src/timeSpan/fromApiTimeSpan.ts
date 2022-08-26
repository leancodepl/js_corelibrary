import { ApiTimeSpan } from "@leancode/api-date";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import parseApiTimeSpan from "../utils/parseApiTimeSpan";

dayjs.extend(duration);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
function fromApiTimeSpan(timeSpan: ApiTimeSpan): Duration;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): Duration | undefined;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): Duration | undefined {
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

export default fromApiTimeSpan;
