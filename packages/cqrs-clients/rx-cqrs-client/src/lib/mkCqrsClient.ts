import { ApiResponse, CommandResult, TokenProvider } from "@leancodepl/cqrs-client-base";
import { handleResponse } from "@leancodepl/validation";
import { catchError, from, of } from "rxjs";
import { AjaxConfig, AjaxError, ajax } from "rxjs/ajax";
import { map, mergeMap } from "rxjs/operators";
import authGuard from "./authGuard";

export function mkCqrsClient({
    cqrsEndpoint,
    tokenProvider,
    ajaxOptions,
}: {
    cqrsEndpoint: string;
    tokenProvider?: TokenProvider;
    ajaxOptions?: Omit<AjaxConfig, "body" | "headers" | "method" | "responseType" | "url">;
}) {
    return {
        createQuery<TQuery, TResult>(type: string) {
            const queryCall = (dto: TQuery, token?: string) =>
                ajax<TResult>({
                    ...ajaxOptions,
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
                        map(({ response }) => response),
                    );
            }

            return (dto: TQuery) => queryCall(dto).pipe(map(({ response }) => response));
        },
        createOperation<TOperation, TResult>(type: string) {
            const operationCall = (dto: TOperation, token?: string) =>
                ajax<TResult>({
                    ...ajaxOptions,
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    url: `${cqrsEndpoint}/operation/${type}`,
                    method: "POST",
                    responseType: "json",
                    body: dto,
                });

            if (tokenProvider) {
                return (dto: TOperation) =>
                    from(tokenProvider.getToken()).pipe(
                        mergeMap(token => operationCall(dto, token).pipe(authGuard(tokenProvider))),
                        map(({ response }) => response),
                    );
            }

            return (dto: TOperation) => operationCall(dto).pipe(map(({ response }) => response));
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
            type: string,
            errorCodesMap: TErrorCodes,
        ) {
            const commandCall = (dto: TCommand, token?: string) =>
                ajax<CommandResult<TErrorCodes>>({
                    ...ajaxOptions,
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
                        map(({ response }) => response),
                    );
                }

                return commandCall(dto).pipe(map(({ response }) => response));
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
