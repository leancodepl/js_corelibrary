import { ApiDateTimeOffset } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function fromApiDateTimeOffset(datetime: ApiDateTimeOffset): Dayjs {
    return dayjs(datetime as any, "YYYY-MM-DD HH:mm:ss.SSS Z");
}
