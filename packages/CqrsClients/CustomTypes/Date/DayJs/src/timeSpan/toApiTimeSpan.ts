import { ApiTimeSpan } from "@leancode/api-date";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

dayjs.extend(duration);

//dayjs handles at most milliseconds precision, smaller units are lost in conversion process
function toApiTimeSpan(duration: Duration): ApiTimeSpan;
function toApiTimeSpan(duration: Duration | undefined): ApiTimeSpan | undefined;
function toApiTimeSpan(duration: Duration | undefined): ApiTimeSpan | undefined {
    if (!duration) {
        return undefined;
    }

    const isNegative = duration.asMilliseconds() < 0;

    const absDuration = dayjs.duration(Math.abs(duration.asMilliseconds()));
    const days = Math.floor(absDuration.asDays());

    let stringTimeSpan = "";

    if (isNegative) {
        stringTimeSpan += "-";
    }

    if (days > 0) {
        stringTimeSpan += `${days}.`;
    }

    stringTimeSpan += absDuration.format("HH:mm:ss.SSS");

    return stringTimeSpan as any;
}

export default toApiTimeSpan;
