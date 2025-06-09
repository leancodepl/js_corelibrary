import { catchError, from, map, ReplaySubject, shareReplay, Subject, switchMap } from "rxjs"
import { TraitsConfig } from "../flows/registration/types"
import { AuthenticatorAssuranceLevel, FrontendApi, isSessionAal2Required } from "../kratos"
import { SearchQueryParameters } from "../utils"
import { SessionWithTypedUserTraits } from "./types"

export class BaseSessionManager<TTraitsConfig extends TraitsConfig> {
    api: FrontendApi
    authUrl: string
    loginRoute: string

    session$: Subject<SessionWithTypedUserTraits<TTraitsConfig> | undefined> = new ReplaySubject(1)

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

                            return session
                        }),
                        catchError(async err => {
                            const data = await err.response.json()

                            switch (err.response.status) {
                                case 403:
                                case 422:
                                    if (isSessionAal2Required(data)) {
                                        const searchParams = new URLSearchParams(window.location.search)

                                        if (searchParams.get(SearchQueryParameters.AAL)) {
                                            break
                                        }

                                        const redirectUrl = new URL(this.loginRoute, window.location.href)

                                        if (window.location.pathname === this.loginRoute) {
                                            const searchParams = new URLSearchParams(window.location.search)
                                            searchParams.append(
                                                SearchQueryParameters.AAL,
                                                AuthenticatorAssuranceLevel.Aal2,
                                            )
                                            redirectUrl.search = searchParams.toString()
                                        } else {
                                            redirectUrl.search = new URLSearchParams({
                                                [SearchQueryParameters.AAL]: AuthenticatorAssuranceLevel.Aal2,
                                                [SearchQueryParameters.ReturnTo]: `${window.location.pathname}${window.location.search}`,
                                            }).toString()
                                        }

                                        window.location.href = redirectUrl.toString()
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
