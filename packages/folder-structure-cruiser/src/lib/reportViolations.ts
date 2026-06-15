import { CheckResult } from "./checkResult"
import { formatMessages, Message, MessageSeverity } from "./formatMessages"
import { logger } from "./logger"

/**
 * Logs the outcome of a check and returns the number of violations found.
 *
 * Shared by every validation command: it prints a success line when the check
 * is clean, or the formatted violations plus a summary count otherwise. Each
 * message is logged at its own severity (`"error"` for hard failures, `"info"`
 * for advisory ones such as shared-component placement), so a single check can
 * mix the two — the summary line uses `"error"` when any error is present.
 *
 * @param checkResult - The messages and cruise summary produced by a `check*` function
 *
 * @returns Number of detected violations
 */
export function reportViolations({ messages, totalCruised }: CheckResult): number {
  if (messages.length === 0) {
    logger.success("✅ No issues found!")
    return 0
  }

  const { error, info } = messages.reduce<Record<MessageSeverity, Message[]>>(
    (grouped, message) => {
      grouped[message.severity].push(message)
      return grouped
    },
    { error: [], info: [] },
  )

  if (error.length > 0) {
    logger.error(formatMessages(error).join("\n"))
  }
  if (info.length > 0) {
    logger.info(formatMessages(info).join("\n"))
  }

  const summarySeverity = error.length > 0 ? "error" : "info"
  logger[summarySeverity](`Found ${messages.length} violation(s). ${totalCruised} modules cruised.`)

  return messages.length
}
