import { ApiDate } from "@leancode/api-dates"
import { Dayjs } from "dayjs"
import dropLocalOffset from "../utils/dropLocalOffset"

export default function toApiDate(time: Dayjs): ApiDate {
    return dropLocalOffset(time).startOf("day").format("YYYY-MM-DD") as any
}
