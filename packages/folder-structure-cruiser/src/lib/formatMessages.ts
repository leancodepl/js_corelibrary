import pc from "picocolors"

const { blue, bold, red } = pc

type Severity = "error" | "info"

const colorSeverity = (type: Severity) => (type === "info" ? blue(type) : red(type))

export interface Message {
  source: string
  target: string
  rule: string
  severity: Severity
}

export function formatMessages(messages: Message[]) {
  return messages.map(
    message =>
      `  ${colorSeverity(message.severity)} ${message.rule}: ${bold(message.source)} → ${bold(message.target)}`,
  )
}
