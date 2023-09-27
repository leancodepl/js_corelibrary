import { useObservable } from "react-use";
import { sessionManager } from "../auth/sessionManager";

export function useIdentity() {
    return useObservable(sessionManager.identity$);
}
