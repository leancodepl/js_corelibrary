import { ApiDateOnly } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";

export default function fromApiDate(date: ApiDateOnly): Dayjs {
    return dayjs(date as any);
}
