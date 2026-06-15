import { Message } from "./formatMessages"

/**
 * The outcome every `check*` function produces and `reportViolations` consumes.
 */
export interface CheckResult {
  messages: Message[]
  totalCruised: number
}
