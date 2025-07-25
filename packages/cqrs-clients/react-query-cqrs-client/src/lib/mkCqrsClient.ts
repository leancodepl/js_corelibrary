import {
    FetchQueryOptions,
    InfiniteData,
    QueryClient,
    QueryFunctionContext,
    QueryKey,
    UndefinedInitialDataInfiniteOptions,
    UndefinedInitialDataOptions,
    Updater,
    useInfiniteQuery,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery,
} from "@tanstack/react-query"
import { catchError, firstValueFrom, from, fromEvent, Observable, of, OperatorFunction, race, throwError } from "rxjs"
import { ajax, AjaxConfig, AjaxError } from "rxjs/ajax"
import { map, mergeMap } from "rxjs/operators"
import {
    ApiResponse,
    ApiSuccess,
    CommandResult,
    FailedCommandResult,
    SuccessfulCommandResult,
    TokenProvider,
} from "@leancodepl/cqrs-client-base"
import { handleResponse, ValidationErrorsHandler } from "@leancodepl/validation"
import { authGuard } from "./authGuard"
import { NullableUncapitalizeDeep } from "./types"
import { uncapitalizedJSONParse } from "./uncapitalizedJSONParse"

export function uncapitalizedParse<TResult>(): OperatorFunction<string, NullableUncapitalizeDeep<TResult>> {
    return $source => $source.pipe(map(uncapitalizedJSONParse))
}

/**
 * Creates React Query CQRS client with hooks for queries, operations, and commands.
 * 
 * Integrates with React Query to provide caching, background updates, and optimistic updates
 * for CQRS operations. Automatically handles authentication, retries, and response transformation
 * with uncapitalized keys.
 * 
 * @param cqrsEndpoint - Base URL for CQRS API endpoints
 * @param queryClient - React Query client instance
 * @param tokenProvider - Optional token provider for authentication
 * @param ajaxOptions - Optional RxJS Ajax configuration options
 * @param tokenHeader - Header name for authentication token (default: "Authorization")
 * @returns Object with `createQuery`, `createOperation`, and `createCommand` hook factories
 * @example
 * ```typescript
 * const client = mkCqrsClient({
 *   cqrsEndpoint: 'https://api.example.com',
 *   queryClient: new QueryClient()
 * });
 * ```
 */
export function mkCqrsClient({
    cqrsEndpoint,
    queryClient,
    tokenProvider,
    ajaxOptions,
    tokenHeader = "Authorization",
}: {
    cqrsEndpoint: string
    queryClient: QueryClient
    tokenProvider?: Partial<TokenProvider>
    ajaxOptions?: Omit<AjaxConfig, "body" | "headers" | "method" | "responseType" | "url">
    tokenHeader?: string
}) {
    function mkFetcher<TData>(endpoint: string, config: Partial<AjaxConfig> = {}) {
        const apiCall = <TResult>(data: TData, token?: string) =>
            ajax<TResult>({
                ...ajaxOptions,
                ...config,
                headers: {
                    [tokenHeader]: token,
                    "Content-Type": "application/json",
                },
                url: `${cqrsEndpoint}/${endpoint}`,
                method: "POST",
                body: data,
                withCredentials: ajaxOptions?.withCredentials ?? true,
            })

        const getToken = tokenProvider?.getToken

        const mk$apiCall = <TResult>(data: TData, token?: string) =>
            apiCall<TResult>(data, token).pipe(
                authGuard(tokenProvider),
                map(result => result.response),
            )

        if (getToken) {
            return <TResult>(data: TData) => from(getToken()).pipe(mergeMap(token => mk$apiCall<TResult>(data, token)))
        }

        return <TResult>(data: TData) => mk$apiCall<TResult>(data)
    }

    return {
        createQuery<TQuery, TResult>(type: string) {
            const fetcher = mkFetcher<TQuery>(`query/${type}`, { responseType: "text" })
            type Result = NullableUncapitalizeDeep<TResult>

            function useApiQuery(
                data: TQuery,
                options?: Omit<UndefinedInitialDataOptions<Result, unknown>, "queryFn" | "queryKey">,
            ) {
                return useQuery<Result, unknown>(
                    {
                        queryKey: useApiQuery.key(data),
                        queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                        ...options,
                    },
                    queryClient,
                )
            }

            useApiQuery.type = type

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
                ])

            useApiQuery.fetch = (
                data: TQuery,
                options?: Omit<FetchQueryOptions<Result, unknown>, "queryFn" | "queryKey">,
            ) =>
                queryClient.fetchQuery({
                    queryKey: useApiQuery.key(data),
                    queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                    ...options,
                })

            useApiQuery.lazy = function <TContext = unknown>(
                options: Omit<UseMutationOptions<Result, unknown, TQuery, TContext>, "mutationFn" | "mutationKey"> = {},
            ) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                return useMutation<Result, unknown, TQuery, TContext>(
                    {
                        mutationKey: [type],
                        mutationFn: variables => firstValueFrom(useApiQuery.fetcher(variables)),
                        ...options,
                    },
                    queryClient,
                )
            }
            useApiQuery.infinite = function (
                initialPageData: TQuery,
                options: Omit<
                    UndefinedInitialDataInfiniteOptions<Result, unknown, InfiniteData<Result>, QueryKey, TQuery>,
                    "initialPageParam" | "queryFn" | "queryKey" | "select"
                >,
            ) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                return useInfiniteQuery<Result, unknown, InfiniteData<Result, TQuery>, QueryKey, TQuery>(
                    {
                        queryKey: [type],
                        queryFn: async context =>
                            await firstValueFrom(useApiQuery.fetcher(context.pageParam as TQuery, context)),
                        initialPageParam: initialPageData,
                        ...options,
                    },
                    queryClient,
                )
            }

            useApiQuery.key = (query: Partial<TQuery>) => [type, query] as const
            function setQueryData(
                query: TQuery,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined
            function setQueryData(
                queryKey: QueryKey,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined
            function setQueryData(
                queryOrQueryKey: QueryKey | TQuery,
                updater: Updater<Result | undefined, Result | undefined>,
            ): Result | undefined {
                const key = Array.isArray(queryOrQueryKey)
                    ? queryOrQueryKey
                    : useApiQuery.key(queryOrQueryKey as TQuery)
                return queryClient.setQueryData(key, updater)
            }
            useApiQuery.setQueryData = setQueryData
            useApiQuery.setQueriesData = (
                query: Partial<TQuery>,
                updater: Updater<Result | undefined, Result | undefined>,
            ) => queryClient.setQueriesData({ queryKey: useApiQuery.key(query) }, updater)
            useApiQuery.getQueryData = (query: TQuery) => queryClient.getQueryData<Result>(useApiQuery.key(query))
            useApiQuery.getQueriesData = (query: Partial<TQuery>) =>
                queryClient.getQueriesData<Result>({ queryKey: useApiQuery.key(query) })

            useApiQuery.prefetch = (
                data: TQuery,
                options?: Omit<FetchQueryOptions<Result, unknown>, "initialData" | "queryFn" | "queryKey">,
            ) =>
                queryClient.prefetchQuery<Result, unknown>({
                    queryKey: useApiQuery.key(data),
                    queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
                    ...options,
                })

            useApiQuery.invalidate = (query: Partial<TQuery>) =>
                queryClient.invalidateQueries({ queryKey: useApiQuery.key(query) })

            useApiQuery.cancel = (query: Partial<TQuery>) =>
                queryClient.cancelQueries({ queryKey: useApiQuery.key(query) })

            useApiQuery.optimisticUpdate = async (
                updater: Updater<Result | undefined, Result | undefined>,
                query: Partial<TQuery> = {},
            ) => {
                await useApiQuery.cancel(query)

                const data = useApiQuery.getQueriesData(query)

                useApiQuery.setQueriesData(query, updater)

                return () => data.forEach(([key, result]) => queryClient.setQueryData<Result>(key, result))
            }

            return useApiQuery
        },
        createOperation<TOperation, TResult>(type: string) {
            const fetcher = mkFetcher<TOperation>(`operation/${type}`, { responseType: "text" })
            type Result = NullableUncapitalizeDeep<TResult>

            function useApiOperation<TContext = unknown>({
                onSuccess: onSuccessBase,
                invalidateQueries,
                ...options
            }: Omit<UseMutationOptions<Result, unknown, TOperation, TContext>, "mutationFn" | "mutationKey"> & {
                invalidateQueries?: QueryKey[]
            } = {}) {
                return useMutation<Result, unknown, TOperation, TContext>(
                    {
                        mutationKey: useApiOperation.key,
                        mutationFn: variables => firstValueFrom(useApiOperation.fetcher(variables)),
                        ...options,
                        async onSuccess(data, variables, context) {
                            const result = await onSuccessBase?.(data, variables, context)

                            if (invalidateQueries) {
                                await Promise.allSettled(
                                    invalidateQueries.map(queryKey => queryClient.invalidateQueries({ queryKey })),
                                )
                            }

                            return result
                        },
                    },
                    queryClient,
                )
            }

            useApiOperation.type = type
            useApiOperation.key = [useApiOperation.type]

            useApiOperation.fetcher = (variables: TOperation): Observable<Result> =>
                fetcher<string>(variables).pipe(uncapitalizedParse())

            return useApiOperation
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string, errorCodes: TErrorCodes) {
            const fetcher = mkFetcher<TCommand>(`command/${type}`)

            function useApiCommand<TContext extends Record<string, unknown> = {}>(
                options?: Omit<
                    UseMutationOptions<
                        ApiSuccess<SuccessfulCommandResult>,
                        ApiResponse<FailedCommandResult<TErrorCodes>>,
                        TCommand,
                        TContext
                    >,
                    "mutationFn" | "mutationKey"
                > & {
                    invalidateQueries?: QueryKey[]
                    handler?: undefined
                    optimisticUpdate?: (variables: TCommand) => Promise<() => void>[]
                },
            ): UseMutationResult<
                ApiSuccess<SuccessfulCommandResult>,
                ApiResponse<FailedCommandResult<TErrorCodes>>,
                TCommand,
                TContext
            >
            function useApiCommand<TResult, TContext extends Record<string, unknown> = {}>(
                options?: Omit<UseMutationOptions<TResult, TResult, TCommand, TContext>, "mutationFn" | "mutationKey"> & {
                    invalidateQueries?: QueryKey[]
                    handler: (
                        handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                    ) => TResult
                    optimisticUpdate?: (variables: TCommand) => Promise<() => void>[]
                },
            ): UseMutationResult<TResult, TResult, TCommand, TContext>
            function useApiCommand<TResult, TContext extends Record<string, unknown> = {}>({
                invalidateQueries,
                handler,
                optimisticUpdate,
                onMutate,
                onError,
                onSettled,
                ...options
            }: Omit<
                UseMutationOptions<
                    ApiSuccess<SuccessfulCommandResult> | TResult,
                    ApiResponse<FailedCommandResult<TErrorCodes>> | TResult,
                    TCommand,
                    TContext
                >,
                "mutationFn" | "mutationKey"
            > & {
                invalidateQueries?: QueryKey[]
                handler?: (
                    handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                ) => TResult
                optimisticUpdate?: (variables: TCommand) => Promise<() => void>[]
            } = {}) {
                return useMutation<
                    ApiSuccess<SuccessfulCommandResult> | TResult,
                    ApiResponse<FailedCommandResult<TErrorCodes>> | TResult,
                    TCommand,
                    TContext & { revertOptimisticUpdate: () => void }
                >(
                    {
                        ...options,
                        mutationKey: useApiCommand.key,
                        mutationFn: (variables: TCommand) => firstValueFrom(useApiCommand.call(variables, handler)),
                        async onMutate(variables) {
                            // there's really no good way to do it without type cast
                            const baseContext = (await onMutate?.(variables)) as TContext

                            const optimisticUpdateReverts = await Promise.all(optimisticUpdate?.(variables) ?? [])

                            return {
                                ...baseContext,
                                revertOptimisticUpdate: () =>
                                    optimisticUpdateReverts.forEach(revertOptimisticUpdate => revertOptimisticUpdate()),
                            }
                        },
                        async onError(error, variables, context) {
                            await onError?.(error, variables, context)

                            context?.revertOptimisticUpdate()
                        },
                        async onSettled(data, error, variables, context) {
                            if (invalidateQueries) {
                                await Promise.allSettled(
                                    invalidateQueries.map(queryKey => queryClient.invalidateQueries({ queryKey })),
                                )
                            }

                            return await onSettled?.(data, error, variables, context)
                        },
                    },
                    queryClient,
                )
            }

            useApiCommand.type = type
            useApiCommand.key = [useApiCommand.type]

            useApiCommand.fetcher = (variables: TCommand) => fetcher<SuccessfulCommandResult>(variables)

            useApiCommand.call = <TResult>(
                variables: TCommand,
                handler?: (
                    handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                ) => TResult,
            ) => {
                const $response = useApiCommand.fetcher(variables)

                return $response.pipe(
                    map(
                        result =>
                            ({
                                isSuccess: true,
                                result,
                            }) as ApiResponse<SuccessfulCommandResult>,
                    ),
                    catchError(e => of(useApiCommand.mapError(e))),
                    map(response => {
                        const result = handler ? useApiCommand.handleResponse(handler)(response) : response

                        if (!response.isSuccess || !response.result.WasSuccessful) {
                            throw result
                        }

                        return result as ApiSuccess<SuccessfulCommandResult> | TResult
                    }),
                )
            }

            useApiCommand.mapError = (e: unknown): ApiResponse<CommandResult<TErrorCodes>> => {
                if (e instanceof AjaxError && e.status === 422) {
                    return {
                        isSuccess: true,
                        result: e.response,
                    }
                }

                return {
                    isSuccess: false,
                    error: e,
                }
            }

            useApiCommand.handleResponse =
                <TResult>(
                    handler: (
                        handler: ValidationErrorsHandler<TErrorCodes & { success: -1; failure: -2 }, never>,
                    ) => TResult,
                ) =>
                (response: ApiResponse<CommandResult<TErrorCodes>>) =>
                    handler(handleResponse(response, errorCodes))

            return useApiCommand
        },
    }
}
