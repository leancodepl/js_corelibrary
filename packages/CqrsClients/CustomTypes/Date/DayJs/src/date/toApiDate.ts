import { ApiDateOnly } from "@leancode/api-date";
import { Dayjs } from "dayjs";
import dropLocalOffset from "../utils/dropLocalOffset";

export default function toApiDate(time: Dayjs): ApiDateOnly {
    return dropLocalOffset(time).startOf("day").format("YYYY-MM-DD") as any;
}
