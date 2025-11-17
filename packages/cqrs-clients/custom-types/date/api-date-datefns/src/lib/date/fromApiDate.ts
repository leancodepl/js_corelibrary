import { parse } from "date-fns"
import type { ApiDateOnly } from "@leancodepl/api-date"

/**
 * Converts ApiDateOnly to JavaScript Date using date-fns.
 *
 * Parses API date string format to JavaScript Date object with support
 * for optional parameters. Uses date-fns parse function internally.
 *
 * @param date - The API date string to convert
 * @returns JavaScript Date object or undefined if date is undefined
 * @example
 * ```typescript
 * import { fromApiDate } from '@leancodepl/api-date-datefns';
 *
 * const jsDate = fromApiDate('2023-12-25');
 * console.log(jsDate); // Date object for December 25, 2023
 * ```
 */
export function fromApiDate(date: ApiDateOnly): Date
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined
export function fromApiDate(date: ApiDateOnly | undefined): Date | undefined {
  if (date && typeof date === "string") {
    return parse(date, "yyyy-MM-dd", new Date())
  }

  return undefined
}
