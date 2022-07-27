import dayjs from "dayjs"
import duration, { Duration } from "dayjs/plugin/duration"
import { ApiTimeSpan } from "@leancode/api-dates"

dayjs.extend(duration)

export default function fromApiTimeSpan(duration: ApiTimeSpan): Duration {
    return dayjs.duration(duration as any)
}