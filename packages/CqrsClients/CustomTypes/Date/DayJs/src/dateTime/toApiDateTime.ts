import { ApiDateTime } from "@leancode/api-date";
import { Dayjs } from "dayjs";

function toApiDateTime(time: Dayjs): ApiDateTime;
function toApiDateTime(time: undefined): undefined;
function toApiDateTime(time?: Dayjs): ApiDateTime | undefined {
    if (!time) {
        return undefined;
    }

    return time.toISOString() as any;
}

export default toApiDateTime;
