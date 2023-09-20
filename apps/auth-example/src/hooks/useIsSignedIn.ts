import { useObservable } from "react-use";
import sessionManager from "../auth/sessionManager";

export default function useIsSignedIn() {
    return useObservable(sessionManager.isSignedIn$);
}
