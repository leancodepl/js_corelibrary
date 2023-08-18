import type { ApiDateOnly } from "@leancodepl/api-date";
import { format } from "date-fns";

export function toApiDate(date: Date): ApiDateOnly;
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined;
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined;
    }

    return format(date, "yyyy-MM-dd") as any;
}
