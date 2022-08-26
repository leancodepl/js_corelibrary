import { ApiDateOnly } from "@leancode/api-date";
import { parse } from "date-fns";

function fromApiDate(date: ApiDateOnly): Date;
function fromApiDate(date: ApiDateOnly | undefined): Date | undefined;
function fromApiDate(date: ApiDateOnly | undefined): Date | undefined {
    if (date && typeof date === "string") {
        return parse(date, "yyyy-MM-dd", new Date());
    }

    return undefined;
}

export default fromApiDate;
