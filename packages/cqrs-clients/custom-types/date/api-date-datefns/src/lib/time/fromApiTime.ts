import { parse } from "date-fns"
import type { ApiTimeOnly } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function fromApiTime(time: ApiTimeOnly): Date
export function fromApiTime(time: ApiTimeOnly | undefined): Date | undefined
export function fromApiTime(time: ApiTimeOnly | undefined): Date | undefined {
  if (!time) {
    return undefined
  }

  return parse(time as any, "HH:mm:ss.SSS", new Date())
}
