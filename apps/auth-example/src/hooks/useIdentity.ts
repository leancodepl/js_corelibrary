import { useObservable } from "react-use";
import sessionManager from "../auth/sessionManager";

export default function useIdentity() {
    return useObservable(sessionManager.identity$);
}
