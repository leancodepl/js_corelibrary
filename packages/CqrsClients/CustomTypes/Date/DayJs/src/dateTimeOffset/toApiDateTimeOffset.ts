import { ApiDateTimeOffset } from "@leancode/api-date";
import { Dayjs } from "dayjs";

export default function toApiDateTimeOffset(time: Dayjs): ApiDateTimeOffset {
    return time.format("YYYY-MM-DD HH:mm:ss.SSS Z") as any;
}
