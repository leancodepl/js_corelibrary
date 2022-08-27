import { ApiTimeSpan } from "@leancode/api-date";
import { parseApiTimeSpan } from "@leancode/api-date-utils";
import { hoursToMilliseconds, minutesToMilliseconds, secondsToMilliseconds } from "date-fns";

function fromApiTimeSpan(timeSpan: ApiTimeSpan): number;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): number | undefined;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): number | undefined {
    if (!timeSpan) {
        return undefined;
    }

    const parsedApiTimeSpan = parseApiTimeSpan(timeSpan);

    const parsedApiTimeSpanValues = parsedApiTimeSpan.values;

    const daysInMilliseconds = hoursToMilliseconds(parsedApiTimeSpanValues.days * 24);
    const hoursInMilliseconds = hoursToMilliseconds(parsedApiTimeSpanValues.hours);
    const minutesInMilliseconds = minutesToMilliseconds(parsedApiTimeSpanValues.minutes);
    const secondsInMilliseconds = secondsToMilliseconds(parsedApiTimeSpanValues.seconds);

    const differenceInMilliseconds =
        daysInMilliseconds +
        hoursInMilliseconds +
        minutesInMilliseconds +
        secondsInMilliseconds +
        parsedApiTimeSpanValues.milliseconds;

    const signBasedMultiplier = parsedApiTimeSpan.sign === "-" ? -1 : 1;

    return signBasedMultiplier * differenceInMilliseconds;
}

export default fromApiTimeSpan;
