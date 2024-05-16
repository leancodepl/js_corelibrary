import dayjs from "dayjs"
import type { ApiTimeOnly } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiTime(time: dayjs.Dayjs): ApiTimeOnly
export function toApiTime(time: dayjs.Dayjs | undefined): ApiTimeOnly | undefined
export function toApiTime(time: dayjs.Dayjs | undefined): ApiTimeOnly | undefined {
    if (!time) {
        return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return time.format("HH:mm:ss.SSS") as any
}
