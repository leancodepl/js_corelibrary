import { Session } from "@ory/kratos-client";
import {
    catchError,
    exhaustMap,
    firstValueFrom,
    from,
    map,
    of,
    ReplaySubject,
    shareReplay,
    Subject,
    switchMap,
} from "rxjs";
import { aalParameterName, returnToParameterName } from "../utils/variables";

export class BaseSessionManager {
    apiUrl: string;
    signInRoute: string;

    session$: Subject<Session | undefined> = new ReplaySubject(1);
    isSignedIn$ = this.session$.pipe(
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

        if (!session) this.checkIfSignedIn();
    }

    checkIfSignedIn = (() => {
        const fetchSubject = new Subject();

        fetchSubject
            .pipe(
                switchMap(() =>
                    from(
                        fetch(`${this.apiUrl}/sessions/whoami`, {
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
                                            const redirectUrl = new URL(this.signInRoute, window.location.href);

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

    signOut = (() => {
        const fetchSubject = new Subject();
        const signOutSubject = new Subject();

        fetchSubject
            .pipe(
                exhaustMap(() =>
                    from(
                        fetch(`${this.apiUrl}/sessions/logout`, {
                            method: "GET",
                            credentials: "include",
                        }),
                    ).pipe(
                        switchMap(() => of(undefined)),
                        catchError(() => of(undefined)),
                    ),
                ),
            )
            .subscribe({
                next: () => {
                    this.session$.next(undefined);
                    signOutSubject.next(undefined);
                },
            });

        return () => {
            fetchSubject.next(undefined);
            return firstValueFrom(signOutSubject);
        };
    })();

    constructor(authUrl: string, signInRoute: string) {
        this.apiUrl = authUrl;
        this.signInRoute = signInRoute;
        this.checkIfSignedIn();
    }
}
