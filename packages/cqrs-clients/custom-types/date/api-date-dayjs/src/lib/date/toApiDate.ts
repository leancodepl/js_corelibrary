import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"
import { dropLocalOffset } from "../utils/dropLocalOffset"

/**
 * Converts Day.js object to ApiDateOnly.
 * 
 * Formats Day.js object to API date string format with support
 * for optional parameters. Uses Day.js format function internally.
 * 
 * @param date - The Day.js object to convert
 * @returns ApiDateOnly string or undefined if date is undefined
 * @example
 * ```typescript
 * import { toApiDate } from '@leancodepl/api-date-dayjs';
 * import dayjs from 'dayjs';
 * 
 * const apiDate = toApiDate(dayjs('2023-12-25'));
 * console.log(apiDate); // '2023-12-25'
 * ```
 */
export function toApiDate(date: dayjs.Dayjs): ApiDateOnly
export function toApiDate(date: dayjs.Dayjs | undefined): ApiDateOnly | undefined
export function toApiDate(date: dayjs.Dayjs | undefined): ApiDateOnly | undefined {
    if (!date) {
        return undefined
    }

    return dropLocalOffset(date).startOf("day").format("YYYY-MM-DD") as any
}
