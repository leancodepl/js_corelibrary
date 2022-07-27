// @ts-nocheck
import { ApiDate } from "@leancode/api-dates"
import dayjs, { Dayjs } from "dayjs"

export default function fromApiDate(time: ApiDate): Dayjs {
    return dayjs(time as any)
}
