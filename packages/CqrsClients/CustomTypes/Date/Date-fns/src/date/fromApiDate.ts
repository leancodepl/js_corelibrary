import { ApiDateOnly } from "@leancode/api-date";
import { parseISO } from "date-fns";

function fromApiDate(date: ApiDateOnly): Date;
function fromApiDate(date: ApiDateOnly | undefined): Date | undefined;
function fromApiDate(date: ApiDateOnly | undefined): Date | undefined {
    if (date && typeof date === "string") {
        return parseISO(date);
    }

    return undefined;
}

export default fromApiDate;
