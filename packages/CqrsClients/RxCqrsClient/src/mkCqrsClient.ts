import { ApiResponse, CommandResult, TokenProvider } from "@leancode/cqrs-client-base";
import { handleResponse } from "@leancode/validation";
import { catchError, from, of } from "rxjs";
import { ajax, AjaxError } from "rxjs/ajax";
import { map, mergeMap, pluck } from "rxjs/operators";
import authGuard from "./authGuard";

export default function mkCqrsClient(cqrsEndpoint: string, tokenProvider?: TokenProvider) {
    return {
        createQuery<TQuery, TResult>(type: string) {
            const queryCall = (dto: TQuery, token?: string) =>
                ajax<TResult>({
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    url: `${cqrsEndpoint}/query/${type}`,
                    method: "POST",
                    responseType: "json",
                    body: dto,
                });

            if (tokenProvider) {
                return (dto: TQuery) =>
                    from(tokenProvider.getToken()).pipe(
                        mergeMap(token => queryCall(dto, token).pipe(authGuard(tokenProvider))),
                        pluck("response"),
                    );
            }

            return (dto: TQuery) => queryCall(dto).pipe(pluck("response"));
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
            type: string,
            errorCodesMap: TErrorCodes,
        ) {
            const commandCall = (dto: TCommand, token?: string) =>
                ajax<CommandResult<TErrorCodes>>({
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    url: `${cqrsEndpoint}/command/${type}`,
                    method: "POST",
                    responseType: "json",
                    body: dto,
                });

            function call(dto: TCommand) {
                if (tokenProvider) {
                    return from(tokenProvider.getToken()).pipe(
                        mergeMap(token => commandCall(dto, token).pipe(authGuard(tokenProvider))),
                        pluck("response"),
                    );
                }

                return commandCall(dto).pipe(pluck("response"));
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

            return call;
        },
    };
}
