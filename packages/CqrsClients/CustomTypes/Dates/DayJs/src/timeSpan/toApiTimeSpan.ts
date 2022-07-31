//@ts-ignore
import { ApiTimeSpan } from "@leancode/api-dates"
import dayjs from "dayjs"
import duration, { Duration } from "dayjs/plugin/duration"
import padTo2 from "../utils/padTo2"

dayjs.extend(duration)

export default function toApiTimeSpan(duration: Duration): ApiTimeSpan {
    const isNegative = duration.asMilliseconds() < 0

    const absDuration = dayjs.duration(Math.abs(duration.asMilliseconds()))
    const days = Math.floor((absDuration.asDays()))
    const fraction = absDuration.milliseconds() * 10000

    let stringTimeSpan = ""

    if (isNegative) {
        stringTimeSpan += "-"
    }
    if (days > 0) {
        stringTimeSpan += `${days}.`
    }

    stringTimeSpan += `${padTo2(absDuration.hours())}:${padTo2(absDuration.minutes())}:${padTo2(absDuration.seconds())}`

    if (fraction > 0) {
        stringTimeSpan += `.${fraction}`
    }

    return stringTimeSpan as any
}
