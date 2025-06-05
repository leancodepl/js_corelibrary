import { useObservable } from "react-use"
import { sessionManager } from ".."

export function useIsLoggedIn() {
    return useObservable(sessionManager.isLoggedIn$)
}
