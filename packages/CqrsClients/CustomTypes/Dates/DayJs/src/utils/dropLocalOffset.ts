import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export default function dropLocalOffset(time: Dayjs) {
    return time.clone().utc(true)
}
