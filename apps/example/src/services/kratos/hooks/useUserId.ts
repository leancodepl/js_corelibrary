import { useObservable } from "react-use"
import { sessionManager } from ".."

export function useUserId() {
    return useObservable(sessionManager.userId$)
}
