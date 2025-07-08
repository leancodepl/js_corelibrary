import { MailpitHelper } from "../services/mailpit/MailpitHelper"

function extractVerificationCodeFromMailText(text: string): string | null {
    // Match a 6-digit code that appears on its own line
    const match = text.match(/^\s*(\d{6})\s*$/m)
    return match ? match[1] : null
}

export const getVerificationCodeFromEmail = async (
    mailpit: MailpitHelper,
    email: string,
    options?: { timeout?: number; interval?: number },
): Promise<string> => {
    const messages = await mailpit.waitForCondition(
        () => mailpit.getEmailsByTo(email),
        result => result.messages_count > 0,
        options,
    )

    if (messages.messages_count === 0) {
        throw new Error(`No emails found for ${email}`)
    }

    const [message] = messages.messages
    const mailMessage = await mailpit.getMail(message.ID)
    const textBody = await mailpit.getMailTextBody(mailMessage)

    return extractVerificationCodeFromMailText(textBody) || ""
}
