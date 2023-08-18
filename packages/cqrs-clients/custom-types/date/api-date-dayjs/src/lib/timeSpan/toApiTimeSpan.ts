import type { ApiTimeSpan } from "@leancodepl/api-date";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiTimeSpan(duration: duration.Duration): ApiTimeSpan;
export function toApiTimeSpan(duration: duration.Duration | undefined): ApiTimeSpan | undefined;
export function toApiTimeSpan(duration: duration.Duration | undefined): ApiTimeSpan | undefined {
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
