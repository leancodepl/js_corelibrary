import { ApiTimeSpan } from "@leancode/api-dates";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";

dayjs.extend(duration);

export default function fromApiTimeSpan(duration: ApiTimeSpan): Duration {
    if (!duration) {
        return dayjs.duration({});
    }

    const isNegative = duration.includes("-");

    if (isNegative) {
        duration = duration.substring(1);
    }

    const durationArray = duration.split(".");

    const mainItemIndex = durationArray.findIndex((item: string) => item.includes(":"));

    const milliseconds = parseInt(durationArray[mainItemIndex + 1] ?? 0);
    const days = parseInt(durationArray[mainItemIndex - 1] ?? 0);

    const detailedDurationArray = durationArray[mainItemIndex]?.split(":");

    const seconds = parseInt(detailedDurationArray[2]);
    const minutes = parseInt(detailedDurationArray[1]);
    const hours = parseInt(detailedDurationArray[0]);

    const dayjsDuration = dayjs.duration({ days, hours, minutes, seconds, milliseconds });

    if (isNegative) {
        return dayjs.duration(-dayjsDuration.asMilliseconds());
    }

    return dayjsDuration;
}
