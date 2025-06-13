import { catchError, from, map, ReplaySubject, shareReplay, Subject, switchMap } from "rxjs"
import { FrontendApi, isSessionAal2Required } from "../kratos"
import { SearchQueryParameters, TraitsConfig } from "../utils"
import { SessionWithTypedUserTraits } from "./types"

export class BaseSessionManager<TTraitsConfig extends TraitsConfig> {
    api: FrontendApi
    authUrl: string
    loginRoute: string

    session$: Subject<SessionWithTypedUserTraits<TTraitsConfig> | undefined> = new ReplaySubject(1)
    isAal2Required$: Subject<boolean | undefined> = new ReplaySubject(1)

    isLoggedIn$ = this.session$.pipe(
        map(session => !!session?.active),
        shareReplay(1),
    )
    identity$ = this.session$.pipe(
        map(session => session?.identity),
        shareReplay(1),
    )
    userId$ = this.identity$.pipe(
        map(identity => identity?.id),
        shareReplay(1),
    )

    setSession(session: SessionWithTypedUserTraits<TTraitsConfig> | undefined) {
        this.session$.next(session)

        if (!session) this.checkIfLoggedIn()
    }

    checkIfLoggedIn = (() => {
        const fetchSubject = new Subject()

        fetchSubject
            .pipe(
                switchMap(() =>
                    from(this.api.toSession()).pipe(
                        map(session => {
                            const returnTo = new URLSearchParams(window.location.search).get(
                                SearchQueryParameters.ReturnTo,
                            )

                            if (returnTo) {
                                window.location.href = returnTo
                            }

                            this.isAal2Required$.next(false)

                            return session
                        }),
                        catchError(async err => {
                            const data = await err.response.json()

                            switch (err.response.status) {
                                case 403:
                                case 422:
                                    if (isSessionAal2Required(data)) {
                                        this.isAal2Required$.next(true)
                                    }
                                    break
                            }

                            return undefined
                        }),
                    ),
                ),
            )
            .subscribe({
                next: session => this.session$.next(session),
            })

        return () => fetchSubject.next(undefined)
    })()

    constructor(api: FrontendApi, authUrl: string, loginRoute: string) {
        this.api = api
        this.authUrl = authUrl
        this.loginRoute = loginRoute
        this.checkIfLoggedIn()
    }
}
