import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

/**
 * This function keeps local time (excluding timezone/offset) but sets its offset to UTC
 */
export function dropLocalOffset(time: dayjs.Dayjs) {
  return time.clone().utc(true)
}
