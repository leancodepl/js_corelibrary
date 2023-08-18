import type { ApiDateOnly } from "@leancodepl/api-date";
import { parse } from "date-fns";

export function fromApiDate(date: ApiDateOnly): Date;
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined;
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined {
    if (date && typeof date === "string") {
        return parse(date, "yyyy-MM-dd", new Date());
    }

    return undefined;
}
