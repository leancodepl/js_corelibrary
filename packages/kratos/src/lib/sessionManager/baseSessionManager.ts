import { AuthenticatorAssuranceLevel, Session } from "@ory/client"
import axios, { AxiosResponse } from "axios"
import { catchError, from, map, of, ReplaySubject, shareReplay, Subject, switchMap } from "rxjs"
import { ErrorId } from "../types/enums/errorId"
import { aalParameterName, returnToParameterName } from "../utils/variables"

/**
 * Manages Kratos session state with RxJS observables for authentication status.
 * 
 * Provides reactive session management with automatic status checking, user identity
 * tracking, and AAL (Authenticator Assurance Level) handling for multi-factor authentication.
 * 
 * @param authUrl - Base URL for Kratos authentication endpoints
 * @param loginRoute - Application route for login page
 * @example
 * ```typescript
 * import { BaseSessionManager } from '@leancodepl/kratos';
 * 
 * const sessionManager = new BaseSessionManager(
 *   'https://auth.example.com',
 *   '/login'
 * );
 * 
 * sessionManager.isLoggedIn.subscribe(loggedIn => {
 *   console.log('User logged in:', loggedIn);
 * });
 * ```
 */
export class BaseSessionManager {
    authUrl
    loginRoute

    session$: Subject<Session | undefined> = new ReplaySubject(1)
    isLoggedIn = this.session$.pipe(
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

    setSession(session: Session | undefined) {
        this.session$.next(session)

        if (!session) this.checkIfLoggedIn()
    }

    checkIfLoggedIn = (() => {
        const fetchSubject = new Subject()

        fetchSubject
            .pipe(
                switchMap(() =>
                    from(
                        axios.get(`${this.authUrl}/sessions/whoami`, {
                            withCredentials: true,
                        }),
                    ).pipe(
                        map((response: AxiosResponse<Session>) => {
                            const returnTo = new URLSearchParams(window.location.search).get(returnToParameterName)

                            if (returnTo) {
                                window.location.href = returnTo
                            }

                            return response.data
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

    constructor(authUrl: string, loginRoute: string) {
        this.authUrl = authUrl
        this.loginRoute = loginRoute
        this.checkIfLoggedIn()
    }
}
