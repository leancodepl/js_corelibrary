import { ApiDateOnly } from "@leancode/api-dates";
import dayjs, { Dayjs } from "dayjs";

export default function fromApiDate(time: ApiDateOnly): Dayjs {
    return dayjs(time as any);
}
