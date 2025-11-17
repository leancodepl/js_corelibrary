import type { ApiTimeSpan } from "@leancodepl/api-date"
import { padTo2 } from "../utils/padTo2"
import { parseDifferenceInMilliseconds } from "../utils/parseDifferenceInMilliseconds"

export function toApiTimeSpan(differenceInMilliseconds: number): ApiTimeSpan
export function toApiTimeSpan(differenceInMilliseconds: number | undefined): ApiTimeSpan | undefined
export function toApiTimeSpan(differenceInMilliseconds: number | undefined): ApiTimeSpan | undefined {
  let stringTimeSpan = ""

  if (!differenceInMilliseconds) {
    return undefined
  }

  const isNegative = differenceInMilliseconds < 0

  const absDifferenceInMilliseconds = Math.abs(differenceInMilliseconds)

  const { milliseconds, seconds, minutes, hours, days } = parseDifferenceInMilliseconds(absDifferenceInMilliseconds)

  if (isNegative) {
    stringTimeSpan += "-"
  }

  if (days > 0) {
    stringTimeSpan += `${days}.`
  }

  stringTimeSpan += `${padTo2(hours)}:${padTo2(minutes)}:${padTo2(seconds)}`

  if (milliseconds > 0) {
    stringTimeSpan += `.${milliseconds}`
  }

  return stringTimeSpan as any
}
