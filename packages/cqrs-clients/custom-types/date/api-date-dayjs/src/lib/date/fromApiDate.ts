import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"

export function fromApiDate(date: ApiDateOnly): dayjs.Dayjs {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dayjs(date as any)
}
