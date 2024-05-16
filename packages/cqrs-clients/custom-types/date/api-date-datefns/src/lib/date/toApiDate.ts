import { format } from "date-fns"
import type { ApiDateOnly } from "@leancodepl/api-date"

export function toApiDate(date: Date): ApiDateOnly
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return format(date, "yyyy-MM-dd") as any
}
