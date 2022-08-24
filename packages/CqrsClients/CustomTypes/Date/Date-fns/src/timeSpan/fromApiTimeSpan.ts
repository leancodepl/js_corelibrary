import { ApiTimeSpan } from "@leancode/api-date";
import { hoursToMilliseconds, intervalToDuration, minutesToMilliseconds, secondsToMilliseconds } from "date-fns";
import parseApiTimeSpan from "../utils/parseApiTimeSpan";

//date-fns duration handles at most seconds precision, smaller units are lost in conversion process
function fromApiTimeSpan(timeSpan: ApiTimeSpan): Duration;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): Duration | undefined;
function fromApiTimeSpan(timeSpan: ApiTimeSpan | undefined): Duration | undefined {
    if (!timeSpan) {
        return undefined;
    }

    const parsedDuration = parseApiTimeSpan(timeSpan);

    const parsedDurationValues = parsedDuration.values;

    const daysInMilliseconds = hoursToMilliseconds((parsedDurationValues.days ?? 0) * 24);
    const hoursInMilliseconds = hoursToMilliseconds(parsedDurationValues.hours ?? 0);
    const minutesInMilliseconds = minutesToMilliseconds(parsedDurationValues.minutes ?? 0);
    const secondsInMilliseconds = secondsToMilliseconds(parsedDurationValues.seconds ?? 0);

    const durationInMilliseconds =
        daysInMilliseconds +
        hoursInMilliseconds +
        minutesInMilliseconds +
        secondsInMilliseconds +
        parsedDurationValues.milliseconds;

    const duration = intervalToDuration({ start: 0, end: durationInMilliseconds });

    const signBasedMultiplier = parsedDuration.sign === "-" ? -1 : 1;

    const transformedDurationEntries = Object.entries(duration).map(([key, value]) => [
        key,
        signBasedMultiplier * (value ?? 0),
    ]);

    const transformedDuration = Object.fromEntries(transformedDurationEntries);

    return transformedDuration;
}

export default fromApiTimeSpan;
