import pc from "picocolors"

const { blue, bold, red } = pc

const colorType = (type: string) => (type === "info" ? blue(type) : red(type))

export interface Message {
  source: string
  target: string
  rule: string
  type: "info" | "error"
}

export function formatMessages(messages: Message[]) {
  return messages.map(message => {
    return `${colorType(message.type)} ${message.rule}: ${bold(message.source)} → ${bold(message.target)}`
  })
}
