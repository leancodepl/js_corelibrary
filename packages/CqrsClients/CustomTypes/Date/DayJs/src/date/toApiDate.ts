import { ApiDateOnly } from "@leancode/api-date";
import { Dayjs } from "dayjs";
import dropLocalOffset from "../utils/dropLocalOffset";

export default function toApiDate(date: Dayjs): ApiDateOnly {
    return dropLocalOffset(date).startOf("day").format("YYYY-MM-DD") as any;
}
