import dayjs from "dayjs"
import { padTo2 } from "../utils/padTo2"
import duration, { Duration } from "dayjs/plugin/duration"
import { ApiTimeSpan } from "@leancode/api-dates"

dayjs.extend(duration)

export default function toApiTimeSpan(duration: Duration): ApiTimeSpan {
    const isNegative = duration.asMilliseconds() < 0
    const days = (isNegative ? Math.ceil : Math.floor)(duration.asDays())
    const fraction = duration.milliseconds() * 10000

    let stringTimeSpan = ""

    if (isNegative) {
        stringTimeSpan += "-"
    }
    if (days > 0) {
        stringTimeSpan += `${days}.`
    }

    stringTimeSpan += `${padTo2(duration.hours())}:${padTo2(duration.minutes())}:${padTo2(duration.seconds())}`

    if (fraction > 0) {
        stringTimeSpan += `.${fraction}`
    }

    return stringTimeSpan as any
}
