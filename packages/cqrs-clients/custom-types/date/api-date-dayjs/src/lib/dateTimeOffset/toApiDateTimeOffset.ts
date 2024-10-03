import dayjs from "dayjs"
import type { ApiDateTimeOffset } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiDateTimeOffset(time: dayjs.Dayjs): ApiDateTimeOffset
export function toApiDateTimeOffset(time: dayjs.Dayjs | undefined): ApiDateTimeOffset | undefined
export function toApiDateTimeOffset(time: dayjs.Dayjs | undefined): ApiDateTimeOffset | undefined {
    if (!time) {
        return undefined
    }

    return time.format("YYYY-MM-DDTHH:mm:ss.SSSZ") as any
}
