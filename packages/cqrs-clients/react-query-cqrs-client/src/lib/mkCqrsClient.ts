import {
  DefaultError,
  FetchQueryOptions,
  InfiniteData,
  QueryClient,
  QueryFilters,
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
import { handleResponse, SuccessOrFailureMarker, ValidationErrorsHandler } from "@leancodepl/validation"
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
  function mkFetcher<TData, TResult>(endpoint: string, config: Partial<AjaxConfig> = {}) {
    const apiCall = (data: TData, token?: string) =>
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

    const mk$apiCall = (data: TData, token?: string) =>
      apiCall(data, token).pipe(
        authGuard(tokenProvider),
        map(result => result.response),
      )

    if (getToken) {
      return (data: TData) => from(getToken()).pipe(mergeMap(token => mk$apiCall(data, token)))
    }

    return (data: TData) => mk$apiCall(data)
  }

  return {
    createQuery<TQuery, TResult>(type: string) {
      const fetcher = mkFetcher<TQuery, string>(`query/${type}`, { responseType: "text" })
      type TUncapitalizedResult = NullableUncapitalizeDeep<TResult>
      type TQueryKey = Readonly<[string, Partial<TQuery>?]>

      function useApiQuery(
        data: TQuery,
        options?: Omit<
          UndefinedInitialDataOptions<TUncapitalizedResult, DefaultError, TUncapitalizedResult, TQueryKey>,
          "queryFn" | "queryKey"
        >,
      ) {
        return useQuery<TUncapitalizedResult, DefaultError, TUncapitalizedResult, TQueryKey>(
          {
            queryKey: useApiQuery.key(data),
            queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
            ...options,
          },
          queryClient,
        )
      }

      useApiQuery.type = type

      useApiQuery.fetcher = (
        data: TQuery,
        context?: QueryFunctionContext<TQueryKey>,
      ): Observable<TUncapitalizedResult> =>
        race([
          fetcher(data).pipe(uncapitalizedParse<TResult>()),
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
        options?: Omit<
          FetchQueryOptions<TUncapitalizedResult, DefaultError, TUncapitalizedResult, TQueryKey>,
          "queryFn" | "queryKey"
        >,
      ) =>
        queryClient.fetchQuery({
          queryKey: useApiQuery.key(data),
          queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
          ...options,
        })

      useApiQuery.lazy = function <TOnMutateResult = unknown>(
        options: Omit<
          UseMutationOptions<TUncapitalizedResult, DefaultError, TQuery, TOnMutateResult>,
          "mutationFn" | "mutationKey"
        > = {},
      ) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMutation<TUncapitalizedResult, DefaultError, TQuery, TOnMutateResult>(
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
          UndefinedInitialDataInfiniteOptions<
            TUncapitalizedResult,
            DefaultError,
            InfiniteData<TUncapitalizedResult>,
            TQueryKey,
            TQuery
          >,
          "initialPageParam" | "queryFn" | "queryKey" | "select"
        >,
      ) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useInfiniteQuery<
          TUncapitalizedResult,
          DefaultError,
          InfiniteData<TUncapitalizedResult, TQuery>,
          TQueryKey,
          TQuery
        >(
          {
            queryKey: [type],
            queryFn: context => firstValueFrom(useApiQuery.fetcher(context.pageParam as TQuery, context)),
            initialPageParam: initialPageData,
            ...options,
          },
          queryClient,
        )
      }

      useApiQuery.key = (query: Partial<TQuery>) => [type, query] as TQueryKey
      function setQueryData(
        query: TQuery,
        updater: Updater<TUncapitalizedResult | undefined, TUncapitalizedResult | undefined>,
      ): TUncapitalizedResult | undefined
      function setQueryData(
        queryKey: TQueryKey,
        updater: Updater<TUncapitalizedResult | undefined, TUncapitalizedResult | undefined>,
      ): TUncapitalizedResult | undefined
      function setQueryData(
        queryOrQueryKey: TQuery | TQueryKey,
        updater: Updater<TUncapitalizedResult | undefined, TUncapitalizedResult | undefined>,
      ): TUncapitalizedResult | undefined {
        const key = Array.isArray(queryOrQueryKey)
          ? (queryOrQueryKey as TQueryKey)
          : useApiQuery.key(queryOrQueryKey as TQuery)
        return queryClient.setQueryData<TUncapitalizedResult, TQueryKey, TUncapitalizedResult>(key, updater)
      }
      useApiQuery.setQueryData = setQueryData
      useApiQuery.setQueriesData = (
        query: Partial<TQuery>,
        updater: Updater<TUncapitalizedResult | undefined, TUncapitalizedResult | undefined>,
      ) => queryClient.setQueriesData({ queryKey: useApiQuery.key(query) }, updater)
      useApiQuery.getQueryData = (query: TQuery) =>
        queryClient.getQueryData<TUncapitalizedResult, TQueryKey>(useApiQuery.key(query))
      useApiQuery.getQueriesData = (query: Partial<TQuery>) =>
        queryClient.getQueriesData<TUncapitalizedResult, QueryFilters<TQueryKey>>({
          queryKey: useApiQuery.key(query),
        })

      useApiQuery.prefetch = (
        data: TQuery,
        options?: Omit<
          FetchQueryOptions<TUncapitalizedResult, DefaultError, TUncapitalizedResult, TQueryKey>,
          "initialData" | "queryFn" | "queryKey"
        >,
      ) =>
        queryClient.prefetchQuery<TUncapitalizedResult, DefaultError, TUncapitalizedResult, TQueryKey>({
          queryKey: useApiQuery.key(data),
          queryFn: context => firstValueFrom(useApiQuery.fetcher(data, context)),
          ...options,
        })

      useApiQuery.invalidate = (query: Partial<TQuery>) =>
        queryClient.invalidateQueries({ queryKey: useApiQuery.key(query) })

      useApiQuery.cancel = (query: Partial<TQuery>) => queryClient.cancelQueries({ queryKey: useApiQuery.key(query) })

      useApiQuery.optimisticUpdate = async (
        updater: Updater<TUncapitalizedResult | undefined, TUncapitalizedResult | undefined>,
        query: Partial<TQuery> = {},
      ) => {
        await useApiQuery.cancel(query)

        const data = useApiQuery.getQueriesData(query)

        useApiQuery.setQueriesData(query, updater)

        return () => data.forEach(([key, result]) => queryClient.setQueryData<TUncapitalizedResult>(key, result))
      }

      return useApiQuery
    },
    createOperation<TOperation, TResult>(type: string) {
      const fetcher = mkFetcher<TOperation, string>(`operation/${type}`, { responseType: "text" })
      type TUncapitalizedResult = NullableUncapitalizeDeep<TResult>
      type TOperationKey = Readonly<[string]>

      function useApiOperation<TOnMutateResult = unknown>({
        onSuccess: onSuccessBase,
        invalidateQueries,
        ...options
      }: Omit<
        UseMutationOptions<TUncapitalizedResult, DefaultError, TOperation, TOnMutateResult>,
        "mutationFn" | "mutationKey"
      > & {
        invalidateQueries?: QueryKey[]
      } = {}) {
        return useMutation<TUncapitalizedResult, DefaultError, TOperation, TOnMutateResult>(
          {
            mutationKey: useApiOperation.key,
            mutationFn: variables => firstValueFrom(useApiOperation.fetcher(variables)),
            ...options,
            async onSuccess(data, variables, onMutateResult, context) {
              const result = await onSuccessBase?.(data, variables, onMutateResult, context)

              if (invalidateQueries) {
                await Promise.allSettled(invalidateQueries.map(queryKey => queryClient.invalidateQueries({ queryKey })))
              }

              return result
            },
          },
          queryClient,
        )
      }

      useApiOperation.type = type
      useApiOperation.key = [useApiOperation.type] as TOperationKey

      useApiOperation.fetcher = (variables: TOperation): Observable<TUncapitalizedResult> =>
        fetcher(variables).pipe(uncapitalizedParse())

      return useApiOperation
    },
    createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string, errorCodes: TErrorCodes) {
      const fetcher = mkFetcher<TCommand, SuccessfulCommandResult>(`command/${type}`)
      type TCommandKey = Readonly<[string]>
      type Handler<TResult> = (
        handler: ValidationErrorsHandler<SuccessOrFailureMarker & TErrorCodes, never>,
        variables: TCommand,
      ) => TResult

      function useApiCommand<TOnMutateResult extends Record<string, unknown> = {}>(
        options?: Omit<
          UseMutationOptions<
            ApiSuccess<SuccessfulCommandResult>,
            ApiResponse<FailedCommandResult<TErrorCodes>>,
            TCommand,
            TOnMutateResult
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
        TOnMutateResult
      >
      function useApiCommand<TResult, TOnMutateResult extends Record<string, unknown> = {}>(
        options?: Omit<
          UseMutationOptions<TResult, TResult, TCommand, TOnMutateResult>,
          "mutationFn" | "mutationKey"
        > & {
          invalidateQueries?: QueryKey[]
          handler: Handler<TResult>
          optimisticUpdate?: (variables: TCommand) => Promise<() => void>[]
        },
      ): UseMutationResult<TResult, TResult, TCommand, TOnMutateResult>
      function useApiCommand<TResult, TOnMutateResult extends Record<string, unknown> = {}>({
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
          TOnMutateResult
        >,
        "mutationFn" | "mutationKey"
      > & {
        invalidateQueries?: QueryKey[]
        handler?: Handler<TResult>
        optimisticUpdate?: (variables: TCommand) => Promise<() => void>[]
      } = {}) {
        return useMutation<
          ApiSuccess<SuccessfulCommandResult> | TResult,
          ApiResponse<FailedCommandResult<TErrorCodes>> | TResult,
          TCommand,
          TOnMutateResult & { revertOptimisticUpdate: () => void }
        >(
          {
            ...options,
            mutationKey: useApiCommand.key,
            mutationFn: variables => firstValueFrom(useApiCommand.call(variables, handler)),
            async onMutate(variables, context) {
              // there's really no good way to do it without type cast
              const baseResult = (await onMutate?.(variables, context)) as TOnMutateResult

              const optimisticUpdateReverts = await Promise.all(optimisticUpdate?.(variables) ?? [])

              return {
                ...baseResult,
                revertOptimisticUpdate: () =>
                  optimisticUpdateReverts.forEach(revertOptimisticUpdate => revertOptimisticUpdate()),
              }
            },
            async onError(error, variables, onMutateResult, context) {
              await onError?.(error, variables, onMutateResult, context)

              onMutateResult?.revertOptimisticUpdate()
            },
            // eslint-disable-next-line max-params
            async onSettled(data, error, variables, onMutateResult, context) {
              if (invalidateQueries) {
                await Promise.allSettled(invalidateQueries.map(queryKey => queryClient.invalidateQueries({ queryKey })))
              }

              return await onSettled?.(data, error, variables, onMutateResult, context)
            },
          },
          queryClient,
        )
      }

      useApiCommand.type = type
      useApiCommand.key = [useApiCommand.type] as TCommandKey

      useApiCommand.fetcher = fetcher

      useApiCommand.call = <TResult>(variables: TCommand, handler?: Handler<TResult>) => {
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
            const result = handler ? useApiCommand.handleResponse(handler, variables)(response) : response

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
        <TResult>(handler: Handler<TResult>, variables: TCommand) =>
        (response: ApiResponse<CommandResult<TErrorCodes>>) =>
          handler(handleResponse(response, errorCodes), variables)

      return useApiCommand
    },
  }
}
