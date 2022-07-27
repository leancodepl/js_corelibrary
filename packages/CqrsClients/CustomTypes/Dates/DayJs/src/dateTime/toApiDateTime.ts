import { Dayjs } from "dayjs"
import { ApiDateTime } from "@leancode/api-dates"
import dropLocalOffset from "../utils/dropLocalOffset"

type Options = { isUtc: boolean }

export default function toApiDateTime(time: Dayjs, options?: Options): ApiDateTime {
    const adjustedDateTime = options?.isUtc ? dropLocalOffset(time) : time

    return adjustedDateTime.toISOString() as any
}