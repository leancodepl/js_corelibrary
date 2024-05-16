import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"
import { dropLocalOffset } from "../utils/dropLocalOffset"

export function toApiDate(date: dayjs.Dayjs): ApiDateOnly {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dropLocalOffset(date).startOf("day").format("YYYY-MM-DD") as any
}
