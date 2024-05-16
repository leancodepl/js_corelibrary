import { parse } from "date-fns"
import type { ApiDateOnly } from "@leancodepl/api-date"

export function fromApiDate(date: ApiDateOnly): Date
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined {
    if (date && typeof date === "string") {
        return parse(date, "yyyy-MM-dd", new Date())
    }

    return undefined
}
