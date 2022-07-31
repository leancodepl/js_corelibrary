//@ts-ignore
import { ApiTimeSpan } from "@leancode/api-dates"
import dayjs from "dayjs"
import duration, { Duration } from "dayjs/plugin/duration"

dayjs.extend(duration)

export default function fromApiTimeSpan(duration: ApiTimeSpan): Duration {
    if (!duration) {
        return dayjs.duration({})
    }

    const isNegative = duration.includes("-")

    if (isNegative) {
        duration = duration.substring(1)
    }

    const durationArray = duration.split(".")

    const mainItemIndex = durationArray.findIndex((item: string) => item.includes(":"))

    const milliseconds = parseInt(durationArray[mainItemIndex + 1])
    const days = parseInt(durationArray[mainItemIndex - 1])

    const detailedDurationArray = durationArray[mainItemIndex]?.split(":")
    const detailedDurationArrayLength = detailedDurationArray.length

    const seconds = parseInt(detailedDurationArray[detailedDurationArrayLength - 1])
    const minutes = parseInt(detailedDurationArray[detailedDurationArrayLength - 2])
    const hours = parseInt(detailedDurationArray[detailedDurationArrayLength - 3])

    const dayjsDuration = dayjs.duration({ days, hours, minutes, seconds, milliseconds })

    if (isNegative) {
        return dayjs.duration(-dayjsDuration.asMilliseconds())
    }

    return dayjsDuration
}