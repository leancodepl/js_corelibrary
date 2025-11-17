import dayjs from "dayjs"
import type { ApiDateOnly } from "@leancodepl/api-date"

/**
 * Converts ApiDateOnly to Day.js object.
 *
 * Parses API date string format to Day.js object with support
 * for optional parameters. Uses Day.js constructor internally.
 *
 * @param date - The API date string to convert
 * @returns Day.js object or undefined if date is undefined
 * @example
 * ```typescript
 * import { fromApiDate } from '@leancodepl/api-date-dayjs';
 *
 * const dayjsDate = fromApiDate('2023-12-25');
 * console.log(dayjsDate.format('YYYY-MM-DD')); // '2023-12-25'
 * ```
 */
export function fromApiDate(date: ApiDateOnly): dayjs.Dayjs
export function fromApiDate(date: ApiDateOnly | undefined): dayjs.Dayjs | undefined
export function fromApiDate(date: ApiDateOnly | undefined): dayjs.Dayjs | undefined {
  if (!date) {
    return undefined
  }

  return dayjs(date as any)
}
