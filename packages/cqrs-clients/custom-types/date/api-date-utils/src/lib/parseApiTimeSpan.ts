import type { ApiTimeSpan } from "@leancodepl/api-date"

const parseIntMatched = (value: string | undefined) => parseInt(value ?? "0")

/**
 * Parses ApiTimeSpan string into structured time components.
 *
 * Extracts sign, days, hours, minutes, seconds, and milliseconds from
 * ApiTimeSpan string format using regex pattern matching.
 *
 * @param timespan - The ApiTimeSpan string to parse
 * @returns Object with sign and time component values
 * @example
 * ```typescript
 * const result = parseApiTimeSpan('1.23:45:67.890');
 * console.log(result.values.hours); // 23
 * ```
 */
export function parseApiTimeSpan(timespan: ApiTimeSpan) {
  /**
   * This regex returns tuple of matched strings (either of string type or undefined) and default match function parameters
   * following [timeSpan, sign, days, hours, minutes, seconds, milliseconds, index of search at which the result was found, input (search string), groups] schema
   */
  const matched = (timespan as any).match(/^(-)?([0-9]+)?\.?([0-9]{2}):([0-9]{2}):([0-9]{2})\.?([0-9]{3})?$/)

  return {
    sign: matched?.[1],
    values: {
      days: parseIntMatched(matched?.[2]),
      hours: parseIntMatched(matched?.[3]),
      minutes: parseIntMatched(matched?.[4]),
      seconds: parseIntMatched(matched?.[5]),
      milliseconds: parseIntMatched(matched?.[6]),
    },
  }
}
