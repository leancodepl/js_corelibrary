import chalk from "chalk"

const { bold } = chalk

type Severity = "error" | "info"

export interface Message {
  source: string
  target: string
  rule: string
  severity: Severity
}

export function formatMessages(messages: Message[]) {
  return messages.map(message => `${message.rule}: ${bold(message.source)} → ${bold(message.target)}`)
}
