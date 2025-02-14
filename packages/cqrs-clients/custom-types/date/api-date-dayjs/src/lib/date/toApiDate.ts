import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"
import { dropLocalOffset } from "../utils/dropLocalOffset"

export function toApiDate(date: dayjs.Dayjs): ApiDateOnly
export function toApiDate(date: dayjs.Dayjs | undefined): ApiDateOnly | undefined
export function toApiDate(date: dayjs.Dayjs | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined
    }

    return dropLocalOffset(date).startOf("day").format("YYYY-MM-DD") as any
}
