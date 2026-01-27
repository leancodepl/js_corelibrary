import { ApiError, ApiResponse, ApiSuccess, CommandResult, TokenProvider } from "@leancodepl/cqrs-client-base"
import { UncapitalizeDeep, uncapitalizeDeep } from "@leancodepl/utils"
import { handleResponse } from "@leancodepl/validation"

function createSuccess<TResult>(result: TResult): ApiSuccess<UncapitalizeDeep<TResult>> {
  return {
    isSuccess: true,
    result: uncapitalizeDeep(result),
  }
}

function createError(
  error: unknown,
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

/**
 * Configuration options for the CQRS client.
 */
export type MkCqrsClientParameters = {
  /** Base URL for CQRS API endpoints */
  cqrsEndpoint: string
  /** Optional token provider for authentication */
  tokenProvider?: TokenProvider
  /** Optional fetch configuration options */
  fetchOptions?: Omit<RequestInit, "body" | "headers" | "method">
  /** Header name for authentication token (default: "Authorization") */
  tokenHeader?: string
}

/**
 * Creates CQRS client using native fetch API for Next.js applications with automatic response uncapitalization.
 *
 * @param params - Configuration object for CQRS client
 * @param params.cqrsEndpoint - Base URL for CQRS API endpoints
 * @param params.tokenProvider - Optional token provider for authentication
 * @param params.fetchOptions - Optional fetch configuration options
 * @param params.tokenHeader - Header name for authentication token (default: "Authorization")
 * @returns Object with `createQuery`, `createOperation`, and `createCommand` factories
 * @example
 * ```typescript
 * import { mkCqrsClient } from "@leancodepl/fetch-client"
 *
 * const client = mkCqrsClient({
 *   cqrsEndpoint: "https://api.example.com",
 *   tokenProvider: {
 *     getToken: () => Promise.resolve(localStorage.getItem("token")),
 *   },
 * })
 * ```
 */
export function mkCqrsClient({
  cqrsEndpoint,
  tokenProvider,
  fetchOptions,
  tokenHeader = "Authorization",
}: MkCqrsClientParameters) {
  async function handleFetchResponse<TResult>(
    response: Response,
    isRetry = false,
  ): Promise<{ data: ApiResponse<TResult>; shouldRetry: boolean }> {
    switch (response.status) {
      case 200:
        return { data: createSuccess(await response.json()), shouldRetry: false }
      case 401:
        if (isRetry) {
          return {
            data: createError("The request has not been authorized and token refresh did not help"),
            shouldRetry: false,
          }
        }
        if (!tokenProvider?.invalidateToken) {
          return {
            data: createError("User needs to be authenticated to execute the command/query/operation"),
            shouldRetry: false,
          }
        }
        if (!(await tokenProvider.invalidateToken())) {
          return {
            data: createError("Cannot refresh access token after the server returned 401 Unauthorized"),
            shouldRetry: false,
          }
        }
        return { data: createError("Token refreshed"), shouldRetry: true }
      case 400:
        return { data: createError("The request was malformed"), shouldRetry: false }
      case 403:
        return {
          data: createError("User is not authorized to execute the command/query/operation"),
          shouldRetry: false,
        }
      case 404:
        return { data: createError("Command/query/operation not found"), shouldRetry: false }
      case 422:
        return { data: createSuccess(await response.json()), shouldRetry: false }
      default:
        return {
          data: createError(`Cannot execute command/query/operation, server returned a ${response.status} code`),
          shouldRetry: false,
        }
    }
  }

  async function doFetch<TResult>(url: string, body: unknown, options?: RequestInit): Promise<ApiResponse<TResult>> {
    const token = await tokenProvider?.getToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers[tokenHeader] = `Bearer ${token}`
    }

    const makeFetchRequest = async (isRetry = false): Promise<ApiResponse<TResult>> => {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          ...options,
          method: "POST",
          headers,
          body: JSON.stringify(body),
        })

        const { data, shouldRetry } = await handleFetchResponse<TResult>(response, isRetry)

        if (shouldRetry && !isRetry) {
          const newToken = await tokenProvider?.getToken()

          if (newToken) {
            headers[tokenHeader] = `Bearer ${newToken}`
          }

          return makeFetchRequest(true)
        }

        return data
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return createError(error, { isAborted: true })
        }

        return createError(error)
      }
    }

    return makeFetchRequest()
  }

  return {
    createQuery<TQuery, TResult>(type: string) {
      return (dto: TQuery, options?: RequestInit) => {
        const abortController = new AbortController()

        const promise = doFetch<UncapitalizeDeep<TResult>>(`${cqrsEndpoint}/query/${type}`, dto, {
          ...options,
          signal: abortController.signal,
        }) as QueryPromise<UncapitalizeDeep<TResult>>

        promise.abort = abortController.abort.bind(abortController)

        return promise
      }
    },
    createOperation<TOperation, TResult>(type: string) {
      return (dto: TOperation, options?: RequestInit) =>
        doFetch<UncapitalizeDeep<TResult>>(`${cqrsEndpoint}/operation/${type}`, dto, {
          cache: "no-store",
          ...options,
        })
    },
    createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(type: string, errorCodesMap: TErrorCodes) {
      async function call(dto: TCommand, options?: RequestInit) {
        return doFetch<CommandResult<TErrorCodes>>(`${cqrsEndpoint}/command/${type}`, dto, {
          cache: "no-store",
          ...options,
        })
      }

      call.handle = (dto: TCommand) => call(dto).then(response => handleResponse(response, errorCodesMap))

      return call
    },
  }
}

export type QueryAbort = Pick<AbortController, "abort">
export type QueryPromise<TResult> = Promise<ApiResponse<TResult>> & QueryAbort
