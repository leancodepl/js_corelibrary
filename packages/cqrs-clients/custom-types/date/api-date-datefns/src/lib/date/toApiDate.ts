import { format } from "date-fns"
import type { ApiDateOnly } from "@leancodepl/api-date"

/**
 * Converts JavaScript Date to ApiDateOnly using date-fns.
 * 
 * Formats JavaScript Date object to API date string format with support
 * for optional parameters. Uses date-fns format function internally.
 * 
 * @param date - The JavaScript Date to convert
 * @returns ApiDateOnly string or undefined if date is undefined
 * @example
 * ```typescript
 * import { toApiDate } from '@leancodepl/api-date-datefns';
 * 
 * const apiDate = toApiDate(new Date('2023-12-25'));
 * console.log(apiDate); // '2023-12-25'
 * ```
 */
export function toApiDate(date: Date): ApiDateOnly
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined
export function toApiDate(date: Date | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined
    }

    return format(date, "yyyy-MM-dd") as any
}
