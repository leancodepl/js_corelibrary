import { ApiResponse, CommandResult, TokenProvider } from "@leancodepl/cqrs-client-base";
import { handleResponse, ValidationErrorsHandler } from "@leancodepl/validation";
import type { Updater } from "@tanstack/query-core/build/lib/utils";
import {
    FetchQueryOptions,
    QueryClient,
    QueryFunctionContext,
    QueryKey,
    UseInfiniteQueryOptions,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery,
    UseQueryOptions,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { catchError, firstValueFrom, of, throwError, fromEvent, race, Observable, from, OperatorFunction } from "rxjs";
import { ajax, AjaxError, AjaxConfig } from "rxjs/ajax";
import { map, mergeMap } from "rxjs/operators";
import { authGuard } from "./authGuard";
import { NullableUncapitalizeDeep } from "./types";
import { uncapitalizedJSONParse } from "./uncapitalizedJSONParse";

export function uncapitalizedParse<TResult>(): OperatorFunction<string, NullableUncapitalizeDeep<TResult>> {
    return $source => $source.pipe(map(uncapitalizedJSONParse));
}

export function mkCqrsClient({
    cqrsEndpoint,
    queryClient,
    tokenProvider,
    ajaxOptions,
}: {
    cqrsEndpoint: string;
    queryClient: QueryClient;
    tokenProvider?: Partial<TokenProvider>;
    ajaxOptions?: Omit<AjaxConfig, "headers" | "url" | "method" | "responseType" | "body" | "withCredentials">;
}) {
    function mkFetcher<TData>(endpoint: string, config: Partial<AjaxConfig> = {}) {
        const apiCall = <TResult>(data: TData, token?: string) =>
            ajax<TResult>({
                ...ajaxOptions,
                ...config,
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                url: `${cqrsEndpoint}/${endpoint}`,
                method: "POST",
                body: data,
                withCredentials: true,
            });

        const getToken = tokenProvider?.getToken;

        const mk$apiCall = <TResult>(data: TData, token?: string) =>
            apiCall<TResult>(data, token).pipe(
                authGuard(tokenProvider),
                map(result => result.response),
            );

        if (getToken) {
            return <TResult>(data: TData) => from(getToken()).pipe(mergeMap(token => mk$apiCall<TResult>(data, token)));
        }

        return <TResult>(data: TData) => mk$apiCall<TResult>(data);
    }

    return {
        createQuery<TQuery, TResult>(type: string) {
            const fetcher = mkFetcher<TQuery>(`query/${type}`, { responseType: "text" });
            type Result = NullableUncapitalizeDeep<TResult>;

            function useApiQuery(
                data: TQuery,
                options?: Omit<
                    UseQueryOptions<Result, unknown>,
                    "queryKey" | "queryFn" | "initialData" | "onSuccess" | "onError" | "onSettled" | "isDataEqual"
                >,
            ) {
                return useQuery<Result, unknown>({
                    queryKey: useApiQuery.key(data),
                    queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                    ...options,
                });
            }

            useApiQuery.fetcher = (data: TQuery, context?: QueryFunctionContext<QueryKey>): Observable<Result> =>
                race([
                    fetcher<string>(data).pipe(uncapitalizedParse<TResult>()),
                    ...(context?.signal
                        ? [
                              fromEvent<AbortSignalEventMap["abort"]>(context.signal, "abort").pipe(
                                  mergeMap(() => throwError(() => new Error("Query aborted"))),
                              ),
                          ]
                        : []),
                ]);

            useApiQuery.fetch = (
                data: TQuery,
                options?: Omit<FetchQueryOptions<Result, unknown>, "queryKey" | "queryFn">,
            ) =>
                queryClient.fetchQuery({
                    queryKey: useApiQuery.key(data),
                    queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                    ...options,
                });

            useApiQuery.lazy = function <TContext = unknown>(
                options: Omit<UseMutationOptions<Result, unknown, TQuery, TContext>, "mutationFn" | "mutationKey"> = {},
            ) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                return useMutation<Result, unknown, TQuery, TContext>(
                    [type],
                    variables => firstValueFrom(useApiQuery.fetcher(variables)),
                    options,
                );
            };

            useApiQuery.infinite = function (
                data: TQuery,
                options?: Omit<
                    UseInfiniteQueryOptions<Result, unknown>,
                    "queryKey" | "queryFn" | "initialData" | "onSuccess" | "onError" | "onSettled"
                > & {
                    pageParamKey?: keyof TQuery;
                },
            ) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                return useInfiniteQuery<Result, unknown>({
                    queryKey: useApiQuery.key(data),
                    queryFn: context =>
                        firstValueFrom(
                            useApiQuery.fetcher(
                                options?.pageParamKey ? { ...data, [options.pageParamKey]: context.pageParam } : data,
                                context,
                            ),
                        ),
                    ...options,
                });
            };

            useApiQuery.key = (query: Partial<TQuery>) => [type, query] as const;
            function setQueryData(
                query: TQuery,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined;
            function setQueryData(
                queryKey: QueryKey,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined;
            function setQueryData(
                queryOrQueryKey: QueryKey | TQuery,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined {
                const key = Array.isArray(queryOrQueryKey)
                    ? queryOrQueryKey
                    : useApiQuery.key(queryOrQueryKey as TQuery);
                return queryClient.setQueryData(key, updater);
            }
            useApiQuery.setQueryData = setQueryData;
            useApiQuery.getQueryData = (query: TQuery) => queryClient.getQueryData<Result>(useApiQuery.key(query));
            useApiQuery.getQueriesData = (query: Partial<TQuery>) =>
                queryClient.getQueriesData<Result>({ queryKey: useApiQuery.key(query) });

            useApiQuery.prefetch = (
                data: TQuery,
                options?: Omit<FetchQueryOptions<Result, unknown>, "queryKey" | "queryFn" | "initialData">,
            ) =>
                queryClient.prefetchQuery<Result, unknown>({
                    queryKey: useApiQuery.key(data),
                    queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                    ...options,
                });

            useApiQuery.invalidate = (query: Partial<TQuery>) =>
                queryClient.invalidateQueries({ queryKey: useApiQuery.key(query) });

            return useApiQuery;
        },
        createOperation<TOperation, TResult>(type: string) {
            const fetcher = mkFetcher<TOperation>(`operation/${type}`, { responseType: "text" });
            type Result = NullableUncapitalizeDeep<TResult>;

            function useApiOperation<TContext = unknown>({
                onSuccess: onSuccessBase,
                invalidateQueries,
                ...options
            }: Omit<UseMutationOptions<Result, unknown, TOperation, TContext>, "mutationFn" | "mutationKey"> & {
                invalidateQueries?: QueryKey[];
            } = {}) {
                return useMutation<Result, unknown, TOperation, TContext>({
                    mutationKey: [type],
                    mutationFn: variables => firstValueFrom(useApiOperation.fetcher(variables)),
                    ...options,
                    async onSuccess(data, variables, context) {
                        const result = await onSuccessBase?.(data, variables, context);

                        invalidateQueries &&
                            (await Promise.allSettled(
                                invalidateQueries.map(query => queryClient.invalidateQueries(query)),
                            ));

                        return result;
                    },
                });
            }

            useApiOperation.fetcher = (variables: TOperation): Observable<Result> =>
                fetcher<string>(variables).pipe(uncapitalizedParse());

            return useApiOperation;
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string, errorCodes: TErrorCodes) {
            const fetcher = mkFetcher<TCommand>(`command/${type}`);

            function useApiCommand<TContext = unknown>(
                options?: Omit<
                    UseMutationOptions<CommandResult<TErrorCodes>, unknown, TCommand, TContext>,
                    "mutationFn" | "mutationKey"
                > & {
                    invalidateQueries?: QueryKey[];
                    handler?: undefined;
                },
            ): UseMutationResult<CommandResult<TErrorCodes>, unknown, TCommand, TContext>;
            function useApiCommand<TResult, TContext = unknown>(
                options?: Omit<
                    UseMutationOptions<TResult, unknown, TCommand, TContext>,
                    "mutationFn" | "mutationKey"
                > & {
                    invalidateQueries?: QueryKey[];
                    handler: (
                        handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                    ) => TResult;
                },
            ): UseMutationResult<TResult, unknown, TCommand, TContext>;
            function useApiCommand<TResult, TContext = unknown>({
                invalidateQueries,
                handler,
                onSuccess,
                ...options
            }: Omit<
                UseMutationOptions<CommandResult<TErrorCodes> | TResult, unknown, TCommand, TContext>,
                "mutationFn" | "mutationKey"
            > & {
                invalidateQueries?: QueryKey[];
                handler?: (
                    handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                ) => TResult;
            } = {}) {
                return useMutation<CommandResult<TErrorCodes> | TResult, unknown, TCommand, TContext>({
                    mutationKey: [type],
                    mutationFn: (variables: TCommand) => {
                        if (!handler) {
                            return firstValueFrom(useApiCommand.fetcher(variables));
                        }

                        return firstValueFrom(useApiCommand.call(variables, handler));
                    },
                    ...options,
                    async onSuccess(data, variables, context) {
                        invalidateQueries &&
                            (await Promise.allSettled(
                                invalidateQueries.map(queryKey => queryClient.invalidateQueries(queryKey)),
                            ));

                        const result = await onSuccess?.(data, variables, context);

                        return result;
                    },
                });
            }

            useApiCommand.fetcher = (variables: TCommand) => fetcher<CommandResult<TErrorCodes>>(variables);
            useApiCommand.call = <TResult>(
                variables: TCommand,
                handler: (
                    handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                ) => TResult,
            ) => {
                const $response = useApiCommand.fetcher(variables);

                return $response.pipe(
                    map(
                        result =>
                            ({
                                isSuccess: true,
                                result,
                            } as ApiResponse<CommandResult<TErrorCodes>>),
                    ),
                    catchError(e => of(useApiCommand.mapError(e))),
                    map(useApiCommand.handleResponse(handler)),
                );
            };
            useApiCommand.mapError = (e: unknown): ApiResponse<CommandResult<TErrorCodes>> => {
                if (e instanceof AjaxError && e.status === 422) {
                    return {
                        isSuccess: true,
                        result: e.response,
                    };
                }

                return {
                    isSuccess: false,
                    error: e,
                };
            };
            useApiCommand.handleResponse =
                <TResult>(
                    handler: (
                        handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                    ) => TResult,
                ) =>
                (response: ApiResponse<CommandResult<TErrorCodes>>) =>
                    handler(handleResponse(response, errorCodes));

            return useApiCommand;
        },
    };
}
