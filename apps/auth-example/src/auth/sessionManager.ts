import { map } from "rxjs";
import { BaseSessionManager } from "@leancodepl/kratos";
import { loginRoute } from "../app/routes";
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

export const sessionManager = new SessionManager(environment.authUrl, loginRoute);
