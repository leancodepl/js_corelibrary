import { Session } from "@ory/client";
import { catchError, from, map, of, ReplaySubject, shareReplay, Subject, switchMap } from "rxjs";
import { aalParameterName, returnToParameterName } from "../utils/variables";

export class BaseSessionManager {
    authUrl;
    loginRoute;

    session$: Subject<Session | undefined> = new ReplaySubject(1);
    isLoggedIn = this.session$.pipe(
        map(session => !!session?.active),
        shareReplay(1),
    );
    identity$ = this.session$.pipe(
        map(session => session?.identity),
        shareReplay(1),
    );
    userId$ = this.identity$.pipe(
        map(identity => identity?.id),
        shareReplay(1),
    );

    setSession(session: Session | undefined) {
        this.session$.next(session);

        if (!session) this.checkIfLoggedIn();
    }

    checkIfLoggedIn = (() => {
        const fetchSubject = new Subject();

        fetchSubject
            .pipe(
                switchMap(() =>
                    from(
                        fetch(`${this.authUrl}/sessions/whoami`, {
                            method: "GET",
                            credentials: "include",
                        }),
                    ).pipe(
                        switchMap(response => from(response.json())),
                        map(response => {
                            const returnTo = new URLSearchParams(window.location.search).get(returnToParameterName);

                            if (returnTo) {
                                window.location.href = returnTo;
                            }

                            return response;
                        }),
                        catchError(err => {
                            switch (err.status) {
                                case 403:
                                    if (err.response?.error?.id === "session_aal2_required") {
                                        const searchParams = new URLSearchParams(window.location.search);

                                        if (!searchParams.get(aalParameterName)) {
                                            const redirectUrl = new URL(this.loginRoute, window.location.href);

                                            redirectUrl.search = new URLSearchParams({
                                                [aalParameterName]: "aal2",
                                                [returnToParameterName]: `${window.location.pathname}${window.location.search}`,
                                            }).toString();

                                            window.location.href = redirectUrl.toString();
                                        }
                                    }
                                    break;
                            }

                            return of(undefined);
                        }),
                    ),
                ),
            )
            .subscribe({
                next: session => this.session$.next(session),
            });

        return () => fetchSubject.next(undefined);
    })();

    constructor(authUrl: string, loginRoute: string) {
        this.authUrl = authUrl;
        this.loginRoute = loginRoute;
        this.checkIfLoggedIn();
    }
}
