import { ApiDateOnly } from "@leancode/api-date";
import { format } from "date-fns";

function toApiDate(date: Date): ApiDateOnly;
function toApiDate(date: Date | undefined): ApiDateOnly | undefined;
function toApiDate(date: Date | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined;
    }

    return format(date, "yyyy-MM-dd") as any;
}

export default toApiDate;
