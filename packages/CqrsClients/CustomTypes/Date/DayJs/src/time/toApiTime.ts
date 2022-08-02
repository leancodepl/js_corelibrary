import { ApiTimeOnly } from "@leancode/api-date";
import { Dayjs } from "dayjs";
import dropLocalOffset from "../utils/dropLocalOffset";

type Options = { isUtc: boolean };

export default function toApiTime(time: Dayjs, options?: Options): ApiTimeOnly {
    const adjustedTime = options?.isUtc ? dropLocalOffset(time) : time;

    return `${adjustedTime.toISOString().split("T")[1].split(".")[0]}.000000` as any;
}
