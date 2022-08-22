import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

//this function keeps local time (excluding timezone/offset) but sets its offset to UTC
export default function dropLocalOffset(time: Dayjs) {
    return time.clone().utc(true);
}
