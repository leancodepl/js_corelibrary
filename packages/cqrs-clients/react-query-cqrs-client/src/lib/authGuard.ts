import { TokenProvider } from "@leancodepl/cqrs-client-base"
import { catchError, MonoTypeOperatorFunction, throwError } from "rxjs"

export function authGuard<T>(tokenProvider?: Partial<TokenProvider>): MonoTypeOperatorFunction<T> {
    if (!tokenProvider?.invalidateToken) {
        return response => response
    }

    return response =>
        response.pipe(
            catchError(error => {
                if (error.status === 401) {
                    tokenProvider.invalidateToken?.()
                }

                return throwError(() => error)
            }),
        )
}
