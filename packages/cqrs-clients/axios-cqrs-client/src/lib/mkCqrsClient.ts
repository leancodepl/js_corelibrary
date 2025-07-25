import axios, { AxiosError, AxiosHeaders, CreateAxiosDefaults } from "axios"
import { ApiError, ApiResponse, ApiSuccess, CommandResult, TokenProvider } from "@leancodepl/cqrs-client-base"
import { handleResponse } from "@leancodepl/validation"

function createSuccess<TResult>(result: TResult): ApiSuccess<TResult> {
    return {
        isSuccess: true,
        result,
    }
}

function createError(
    error: any,
    options?: {
        isAborted?: boolean
    },
): ApiError {
    return {
        isSuccess: false,
        isAborted: !!options?.isAborted,
        error,
    }
}

export type MkCqrsClientParameters = {
    cqrsEndpoint: string
    tokenProvider?: TokenProvider
    axiosOptions?: CreateAxiosDefaults
    tokenHeader?: string
}

/**
 * Creates CQRS client with Axios for HTTP communication and command/query handling.
 * 
 * Provides type-safe methods for creating queries, operations, and commands with automatic
 * token management, retry logic, and response handling. Supports validation error handling
 * and HTTP status code management.
 * 
 * @param cqrsEndpoint - Base URL for CQRS API endpoints
 * @param tokenProvider - Optional token provider for authentication
 * @param axiosOptions - Optional Axios configuration options
 * @param tokenHeader - Header name for authentication token (default: "Authorization")
 * @returns Object with `createQuery`, `createOperation`, and `createCommand` methods
 * @example
 * ```typescript
 * const client = mkCqrsClient({
 *   cqrsEndpoint: 'https://api.example.com',
 *   tokenProvider: { getToken: () => Promise.resolve('token') }
 * });
 * ```
 */
export function mkCqrsClient({
    cqrsEndpoint,
    tokenProvider,
    axiosOptions,
    tokenHeader = "Authorization",
}: MkCqrsClientParameters) {
    const apiAxios = axios.create({
        baseURL: cqrsEndpoint,
        ...axiosOptions,
    })

    apiAxios.interceptors.request.use(async config => {
        const token = await tokenProvider?.getToken()

        if (token) {
            config.headers?.set(tokenHeader, `Bearer ${token}`)
        }

        return config
    })

    apiAxios.interceptors.response.use(
        response => {
            response.data = createSuccess(response.data)

            return response
        },
        async (error: unknown) => {
            if (!(error instanceof AxiosError)) {
                return {
                    data: createError(`Unknown error ${error}`),
                }
            }

            if (error.code === "ERR_CANCELED") {
                return {
                    data: createError(error, {
                        isAborted: true,
                    }),
                }
            }

            if (!error.response) {
                return {
                    data: createError(error),
                }
            }

            const response = error.response

            switch (error.response.status) {
                case 401: {
                    let config = error.config

                    if (config?.params?.isRetry) {
                        response.data = createError(
                            "The request has not been authorized and token refresh did not help",
                        )
                        break
                    }
                    if (!tokenProvider?.invalidateToken) {
                        response.data = createError(
                            "User needs to be authenticated to execute the command/query/operation",
                        )
                        break
                    }
                    if (!(await tokenProvider.invalidateToken())) {
                        response.data = createError(
                            "Cannot refresh access token after the server returned 401 Unauthorized",
                        )
                        break
                    }

                    config ??= { headers: new AxiosHeaders() }
                    config.params ??= {}
                    config.params.isRetry = true

                    return await apiAxios.request(config)
                }
                case 400:
                    response.data = createError("The request was malformed")
                    break
                case 403:
                    response.data = createError("User is not authorized to execute the command/query/operation")
                    break
                case 404:
                    response.data = createError("Command/query/operation not found")
                    break
                case 422:
                    response.data = createSuccess(error.response.data)
                    break
                default:
                    response.data = createError(
                        `Cannot execute command/query/operation, server returned a ${error.response.status} code`,
                    )
                    break
            }
            return response
        },
    )

    return {
        createQuery<TQuery, TResult>(type: string) {
            return (dto: TQuery) => {
                const abortController = new AbortController()

                const promise = apiAxios
                    .post<ApiResponse<TResult>>("query/" + type, dto, {
                        signal: abortController.signal,
                    })
                    .then(r => r.data) as QueryPromise<TResult>

                promise.abort = abortController.abort.bind(abortController)

                return promise
            }
        },
        createOperation<TOperation, TResult>(type: string) {
            return (dto: TOperation) => apiAxios.post<ApiResponse<TResult>>("operation/" + type, dto).then(r => r.data)
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
            type: string,
            errorCodesMap: TErrorCodes,
        ) {
            async function call(dto: TCommand) {
                const response = await apiAxios.post<ApiResponse<CommandResult<TErrorCodes>>>("command/" + type, dto)
                return response.data
            }

            call.handle = (dto: TCommand) => call(dto).then(response => handleResponse(response, errorCodesMap))

            return call
        },
    }
}

export type QueryAbort = { abort: AbortController["abort"] }
export type QueryPromise<TResult> = Promise<ApiResponse<TResult>> & QueryAbort
