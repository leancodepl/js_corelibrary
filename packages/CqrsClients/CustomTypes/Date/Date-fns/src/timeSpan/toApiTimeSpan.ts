import { ApiTimeSpan } from "@leancode/api-date";
import { weeksToDays } from "date-fns";
import padTo2 from "../utils/padTo2";

//date-fns duration handles at most seconds precision, smaller units are lost in conversion process
function toApiTimeSpan(duration: Duration): ApiTimeSpan;
function toApiTimeSpan(duration: Duration | undefined): ApiTimeSpan | undefined;
function toApiTimeSpan(duration: Duration | undefined): ApiTimeSpan | undefined {
    if (!duration) {
        return undefined;
    }

    let stringTimeSpan = "";

    const days =
        (duration?.years ?? 0) * 365 +
        (duration?.months ?? 0) * 30 +
        weeksToDays(duration?.weeks ?? 0) +
        (duration?.days ?? 0);

    if (days !== 0) {
        stringTimeSpan += `${days}.`;
    }

    stringTimeSpan += `${padTo2(Math.abs(duration.hours ?? 0))}:${padTo2(Math.abs(duration.minutes ?? 0))}:${padTo2(
        Math.abs(duration.seconds ?? 0),
    )}`;

    return stringTimeSpan as any;
}

export default toApiTimeSpan;
