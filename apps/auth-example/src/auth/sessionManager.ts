import { BaseSessionManager } from "@leancodepl/auth";
import { map } from "rxjs";
import { signInRoute } from "../app/routes";
import environment from "../environments/environment";

class SessionManager extends BaseSessionManager {
    email$ = this.identity$.pipe(
        map(identity => {
            const traits: unknown = identity?.traits;

            return traits && typeof traits === "object" && "email" in traits && typeof traits.email === "string"
                ? traits.email
                : undefined;
        }),
    );
}

export const sessionManager = new SessionManager(`${environment.apiUrl}/api`, signInRoute);
