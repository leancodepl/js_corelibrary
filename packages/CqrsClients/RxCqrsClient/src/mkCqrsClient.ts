import { ApiResponse, CommandResult, TokenProvider } from "@leancode/cqrs-client-base";
import { handleResponse } from "@leancode/validation";
import { catchError, from, of } from "rxjs";
import { ajax, AjaxError } from "rxjs/ajax";
import { map, mergeMap, pluck } from "rxjs/operators";
import authGuard from "./authGuard";

export default function mkCqrsClient(cqrsEndpoint: string, tokenProvider: TokenProvider) {
    return {
        createQuery<TQuery, TResult>(type: string) {
            return (dto: TQuery) =>
                from(tokenProvider.getToken()).pipe(
                    mergeMap(token =>
                        ajax<TResult>({
                            headers: {
                                Authorization: token,
                                "Content-Type": "application/json",
                            },
                            url: `${cqrsEndpoint}/query/${type}`,
                            method: "POST",
                            responseType: "json",
                            body: dto,
                        }).pipe(authGuard(tokenProvider)),
                    ),
                    pluck("response"),
                );
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
            type: string,
            errorCodesMap: TErrorCodes,
        ) {
            function call(dto: TCommand) {
                return from(tokenProvider.getToken()).pipe(
                    mergeMap(token =>
                        ajax<CommandResult<TErrorCodes>>({
                            headers: {
                                Authorization: token,
                                "Content-Type": "application/json",
                            },
                            url: `${cqrsEndpoint}/command/${type}`,
                            method: "POST",
                            responseType: "json",
                            body: dto,
                        }).pipe(authGuard(tokenProvider)),
                    ),
                    pluck("response"),
                );
            }
            call.handle = (dto: TCommand) =>
                call(dto).pipe(
                    map(
                        result =>
                            ({
                                isSuccess: true,
                                result,
                            } as ApiResponse<CommandResult<TErrorCodes>>),
                    ),
                    catchError(e => {
                        if (e instanceof AjaxError && e.status === 422) {
                            return of({
                                isSuccess: true,
                                result: e.response,
                            } as ApiResponse<CommandResult<TErrorCodes>>);
                        }

                        return of({
                            isSuccess: false,
                            error: e,
                        } as ApiResponse<CommandResult<TErrorCodes>>);
                    }),
                    map(response => handleResponse(response, errorCodesMap)),
                );
        },
    };
}
