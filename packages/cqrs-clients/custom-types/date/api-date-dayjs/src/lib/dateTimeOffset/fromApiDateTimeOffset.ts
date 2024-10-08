import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import type { ApiDateTimeOffset } from "@leancodepl/api-date"

dayjs.extend(customParseFormat)

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset): dayjs.Dayjs
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset | undefined): dayjs.Dayjs | undefined
export function fromApiDateTimeOffset(datetime: ApiDateTimeOffset | undefined): dayjs.Dayjs | undefined {
    if (!datetime) {
        return undefined
    }

    return dayjs(datetime as any, "YYYY-MM-DDTHH:mm:ss.SSSZ")
}
