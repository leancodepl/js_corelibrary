import { ApiTimeOnly } from "@leancode/api-dates";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Options = { isUtc: boolean };

export default function fromApiTime(time: ApiTimeOnly, options?: Options): Dayjs {
    const apiTime = time as string;

    if (options?.isUtc) {
        return dayjs.utc(apiTime, "HH:mm:ss").local();
    }

    return dayjs(apiTime, "HH:mm:ss");
}
