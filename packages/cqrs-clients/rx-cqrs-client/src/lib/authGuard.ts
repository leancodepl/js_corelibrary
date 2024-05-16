import { MonoTypeOperatorFunction, Observable, from, of, throwError } from "rxjs"
import { AjaxError } from "rxjs/ajax"
import { mergeMap, retryWhen } from "rxjs/operators"
import { TokenProvider } from "@leancodepl/cqrs-client-base"

export default function authGuard<T>(tokenProvider: TokenProvider): MonoTypeOperatorFunction<T> {
    return response =>
        response.pipe(
            retryWhen((errors$: Observable<AjaxError>) =>
                errors$.pipe(
                    mergeMap((error, i) => {
                        if (i === 0 && error.status === 401) {
                            return from(tokenProvider.invalidateToken()).pipe(
                                mergeMap(success => (success ? of(success) : throwError(() => error))),
                            )
                        }
                        return throwError(() => error)
                    }),
                ),
            ),
        )
}
