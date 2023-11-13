import type { ApiDateOnly } from "@leancodepl/api-date";
import dayjs from "dayjs";

export function fromApiDate(date: ApiDateOnly): dayjs.Dayjs {
    return dayjs(date as any);
}
