import { UiText } from "../kratos"
import { useKratosContext } from "../kratosContext"

export function FormattedMessage({ message }: { message?: Omit<UiText, "type"> }) {
    const {
        components: { MessageFormat },
    } = useKratosContext()

    if (!message) return null

    return <MessageFormat {...message} />
}
