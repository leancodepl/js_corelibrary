import { format } from "date-fns"
import type { ApiTimeOnly } from "@leancodepl/api-date"

/**
 *This function handles at most milliseconds precision, smaller units are lost in conversion process
 */
export function toApiTime(time: Date): ApiTimeOnly
export function toApiTime(time: Date | undefined): ApiTimeOnly | undefined
export function toApiTime(time: Date | undefined): ApiTimeOnly | undefined {
    if (!time) {
        return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return format(time, "HH:mm:ss.SSS") as any
}
