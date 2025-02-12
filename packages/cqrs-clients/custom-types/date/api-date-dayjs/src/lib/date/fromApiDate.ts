import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"

export function fromApiDate(date: ApiDateOnly): dayjs.Dayjs
export function fromApiDate(date: ApiDateOnly | undefined): dayjs.Dayjs | undefined
export function fromApiDate(date: ApiDateOnly | undefined): dayjs.Dayjs | undefined {
    if (!date) {
        return undefined
    }

    return dayjs(date as any)
}
