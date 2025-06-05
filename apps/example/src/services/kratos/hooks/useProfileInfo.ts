import { useObservable } from "react-use"
import { sessionManager } from ".."

export function useProfileInfo() {
    const email = useObservable(sessionManager.email$)
    const firstName = useObservable(sessionManager.firstName$)
    const lastName = useObservable(sessionManager.lastName$)

    return { email, firstName, lastName }
}
