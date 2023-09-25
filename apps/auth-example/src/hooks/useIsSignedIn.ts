import { useObservable } from "react-use";
import { sessionManager } from "../auth/sessionManager";

export function useIsSignedIn() {
    return useObservable(sessionManager.isSignedIn$);
}
