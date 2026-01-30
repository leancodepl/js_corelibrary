import type { Message, MessagesSummary } from "./types"

export class MailpitHelper {
  constructor(private readonly baseUrl: string = process.env.VITE_MAILPIT_URL ?? "http://localhost:8025") {}

  private mailpitUrl(path: string, isApi = true): string {
    return `${this.baseUrl}/${isApi ? "api" : ""}${path}`
  }

  async getMail(id = "latest"): Promise<Message> {
    const res = await fetch(this.mailpitUrl(`/v1/message/${id}`))
    return await res.json()
  }

  async searchEmails(query: string, start = 0, limit = 50): Promise<MessagesSummary> {
    const params = new URLSearchParams({
      query,
      start: start.toString(),
      limit: limit.toString(),
    })
    const url = this.mailpitUrl(`/v1/search?${params.toString()}`)
    const res = await fetch(url)
    return await res.json()
  }

  async getEmailsBySubject(subject: string, start = 0, limit = 50): Promise<MessagesSummary> {
    return this.searchEmails(`subject:${subject}`, start, limit)
  }

  async getEmailsByTo(email: string, start = 0, limit = 50): Promise<MessagesSummary> {
    return this.searchEmails(`to:${email}`, start, limit)
  }

  async getMailTextBody(message: Message): Promise<string> {
    const res = await fetch(this.mailpitUrl(`/view/${message.ID}.txt`, false))
    return await res.text()
  }

  async waitForCondition<T>(
    fn: () => Promise<T>,
    condition: (result: T) => boolean,
    options: { timeout?: number; interval?: number } = {},
  ): Promise<T> {
    const timeout = options.timeout ?? 10000
    const interval = options.interval ?? 500
    const startTime = Date.now()
    while (true) {
      const result = await fn()
      if (condition(result)) return result
      if (Date.now() - startTime > timeout) throw new Error("Timed out waiting for condition")
      await new Promise(res => setTimeout(res, interval))
    }
  }
}
