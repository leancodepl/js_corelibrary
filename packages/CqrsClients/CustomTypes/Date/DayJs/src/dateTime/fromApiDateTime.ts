import { ApiDateTime } from "@leancode/api-date";
import dayjs, { Dayjs } from "dayjs";

type Options = { isUtc?: boolean };

function fromApiDateTime(datetime: ApiDateTime, options?: Options): Dayjs;
function fromApiDateTime(datetime: undefined, options?: Options): undefined;
function fromApiDateTime(datetime?: ApiDateTime, options?: Options): Dayjs | undefined {
    const apiDatetime = datetime as any;

    if (!apiDatetime) {
        return undefined;
    }

    if (options?.isUtc) {
        return dayjs.utc(apiDatetime).local();
    }

    return dayjs(apiDatetime);
}

export default fromApiDateTime;
