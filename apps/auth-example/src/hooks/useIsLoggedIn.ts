import { useObservable } from "react-use";
import { sessionManager } from "../auth/sessionManager";

export function useIsLoggedIn() {
    return useObservable(sessionManager.isLoggedIn);
}
