import type { ApiDateOnly } from "@leancodepl/api-date";
import * as dayjs from "dayjs";
import { dropLocalOffset } from "../utils/dropLocalOffset";

export function toApiDate(date: dayjs.Dayjs): ApiDateOnly {
    return dropLocalOffset(date).startOf("day").format("YYYY-MM-DD") as any;
}
