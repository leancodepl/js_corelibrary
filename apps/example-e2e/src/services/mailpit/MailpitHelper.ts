import type { Message, MessagesSummary, SendEmailOptions, SpamAssassin } from "./types"
import type { APIRequestContext } from "@playwright/test"

export class MailpitHelper {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseUrl: string = process.env.VITE_MAILPIT_URL ?? "http://localhost:8025",
    ) {}

    private mailpitUrl(path: string, isApi = true): string {
        return `${this.baseUrl}/${isApi ? "api" : ""}${path}`
    }

    async getAllMails(start = 0, limit = 50): Promise<MessagesSummary> {
        const res = await this.request.get(this.mailpitUrl(`/v1/messages?start=${start}&limit=${limit}`))
        return await res.json()
    }

    async getMail(id = "latest"): Promise<Message> {
        const res = await this.request.get(this.mailpitUrl(`/v1/message/${id}`))
        return await res.json()
    }

    async sendMail(options?: SendEmailOptions): Promise<{ ID: string }> {
        const body = {
            Attachments: options?.attachments ?? [],
            Bcc: options?.bcc ?? ["bcc@example.com"],
            Cc: options?.cc ?? [{ Email: "cc@example.com", Name: "CC" }],
            From: options?.from ?? { Email: "from@example.com", Name: "From" },
            HTML: options?.htmlBody ?? "<p>hello from mailpit</p>",
            Headers: options?.headers ?? {},
            ReplyTo: options?.replyTo ?? [{ Email: "replyto@example.com", Name: "ReplyTo" }],
            Subject: options?.subject ?? "Hello Mailpit",
            Tags: options?.tags ?? [],
            Text: options?.textBody ?? "hello from mailpit",
            To: options?.to ?? [{ Email: "jane@example.com", Name: "Jane" }],
        }
        const res = await this.request.post(this.mailpitUrl("/v1/send"), {
            data: body,
        })
        return await res.json()
    }

    async searchEmails(query: string, start = 0, limit = 50): Promise<MessagesSummary> {
        const url = this.mailpitUrl(`/v1/search?query=${encodeURIComponent(query)}&start=${start}&limit=${limit}`)
        const res = await this.request.get(url)
        return await res.json()
    }

    async getEmailsBySubject(subject: string, start = 0, limit = 50): Promise<MessagesSummary> {
        return this.searchEmails(`subject:${subject}`, start, limit)
    }

    async getEmailsByTo(email: string, start = 0, limit = 50): Promise<MessagesSummary> {
        return this.searchEmails(`to:${email}`, start, limit)
    }

    async deleteAllEmails(): Promise<void> {
        await this.request.delete(this.mailpitUrl("/v1/messages"))
    }

    async deleteEmailsBySearch(query: string): Promise<void> {
        const url = this.mailpitUrl(`/v1/search?query=${encodeURIComponent(query)}`)
        await this.request.delete(url)
    }

    async getMailHtmlBody(message: Message): Promise<string> {
        const res = await this.request.get(this.mailpitUrl(`/view/${message.ID}.html`, false))
        return await res.text()
    }

    async getMailTextBody(message: Message): Promise<string> {
        const res = await this.request.get(this.mailpitUrl(`/view/${message.ID}.txt`, false))
        return await res.text()
    }

    async getMailSpamAssassinSummary(message: Message): Promise<SpamAssassin> {
        const res = await this.request.get(this.mailpitUrl(`/v1/message/${message.ID}/sa-check`))
        return await res.json()
    }

    // Wait for a condition (polling)
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

    async hasEmailsBySubject(subject: string, options?: { timeout?: number; interval?: number }) {
        return this.waitForCondition(
            () => this.getEmailsBySubject(subject),
            result => result.messages_count > 0,
            options,
        )
    }

    async hasEmailsByTo(email: string, options?: { timeout?: number; interval?: number }) {
        return this.waitForCondition(
            () => this.getEmailsByTo(email),
            result => result.messages_count > 0,
            options,
        )
    }
}
