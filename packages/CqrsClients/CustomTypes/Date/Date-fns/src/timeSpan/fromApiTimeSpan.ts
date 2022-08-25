import { ApiTimeSpan } from "@leancode/api-date";
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

    const duration: Duration = {
        days: parsedDurationValues.days,
        hours: parsedDurationValues.hours,
        minutes: parsedDurationValues.minutes,
        seconds: parsedDurationValues.seconds,
    };

    const signBasedMultiplier = parsedDuration.sign === "-" ? -1 : 1;

    const transformedDurationEntries = Object.entries(duration).map(([key, value]) => [
        key,
        signBasedMultiplier * (value ?? 0),
    ]);

    const transformedDuration = Object.fromEntries(transformedDurationEntries);

    return transformedDuration;
}

export default fromApiTimeSpan;
