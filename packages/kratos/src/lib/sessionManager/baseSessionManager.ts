import { catchError, from, map, of, ReplaySubject, shareReplay, Subject, switchMap } from "rxjs"
import { TraitsConfig } from "../flows/registration/types"
import { AuthenticatorAssuranceLevel, FrontendApi } from "../kratos"
import { SessionWithTypedUserTraits } from "./types"

export const returnToParameterName = "return_to"
export const aalParameterName = "aal"
export const flowIdParameterName = "flow"
export const refreshParameterName = "refresh"

export enum ErrorId {
    ErrIDNeedsPrivilegedSession = "session_refresh_required",
    ErrIDSelfServiceFlowExpired = "self_service_flow_expired",
    ErrIDSelfServiceFlowDisabled = "self_service_flow_disabled",
    ErrIDSelfServiceBrowserLocationChangeRequiredError = "browser_location_change_required",
    ErrIDSelfServiceFlowReplaced = "self_service_flow_replaced",

    ErrIDAlreadyLoggedIn = "session_already_available",
    ErrIDAddressNotVerified = "session_verified_address_required",
    ErrIDSessionHasAALAlready = "session_aal_already_fulfilled",
    ErrIDSessionRequiredForHigherAAL = "session_aal1_required",
    ErrIDHigherAALRequired = "session_aal2_required",
    ErrNoActiveSession = "session_inactive",
    ErrIDRedirectURLNotAllowed = "self_service_flow_return_to_forbidden",
    ErrIDInitiatedBySomeoneElse = "security_identity_mismatch",

    ErrIDCSRF = "security_csrf_violation",
}

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
                            const returnTo = new URLSearchParams(window.location.search).get(returnToParameterName)

                            if (returnTo) {
                                window.location.href = returnTo
                            }

                            return session
                        }),
                        catchError(err => {
                            switch (err.response.status) {
                                case 403:
                                case 422:
                                    if (err.response.data.error?.id === ErrorId.ErrIDHigherAALRequired) {
                                        const searchParams = new URLSearchParams(window.location.search)

                                        if (searchParams.get(aalParameterName)) {
                                            break
                                        }

                                        const redirectUrl = new URL(this.loginRoute, window.location.href)

                                        if (window.location.pathname === this.loginRoute) {
                                            const searchParams = new URLSearchParams(window.location.search)
                                            searchParams.append(aalParameterName, AuthenticatorAssuranceLevel.Aal2)
                                            redirectUrl.search = searchParams.toString()
                                        } else {
                                            redirectUrl.search = new URLSearchParams({
                                                [aalParameterName]: AuthenticatorAssuranceLevel.Aal2,
                                                [returnToParameterName]: `${window.location.pathname}${window.location.search}`,
                                            }).toString()
                                        }

                                        window.location.href = redirectUrl.toString()
                                    }
                                    break
                            }

                            return of(undefined)
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
