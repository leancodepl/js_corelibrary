import { ApiDateTime } from "@leancode/api-dates"
import dayjs, { Dayjs } from "dayjs"

type Options = { isUtc: boolean }

export default function fromApiDateTime(datetime: ApiDateTime, options?: Options): Dayjs {
    const apiDatetime = datetime as any

    if (options?.isUtc) { return dayjs.utc(apiDatetime).local() }

    return dayjs(apiDatetime)
}