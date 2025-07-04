import type { ApiResponse } from "@leancodepl/cqrs-client-base"
import { uncapitalizeDeep } from "@leancodepl/utils"
import { mkCqrsClient, type MkCqrsClientParameters } from "./mkCqrsClient"

function uncapitalizeResponse<TResult>(response: ApiResponse<TResult>) {
    if (!response.isSuccess) {
        return response
    }

    return {
        ...response,
        result: uncapitalizeDeep(response.result),
    }
}

/**
 * Creates CQRS client with automatic response key uncapitalization using "@leancodepl/utils".
 * 
 * Extends the base CQRS client to automatically transform response object keys from
 * PascalCase to camelCase using deep transformation.
 * 
 * @param params - Configuration object for CQRS client
 * @param params.cqrsEndpoint - Base URL for CQRS API endpoints
 * @param params.tokenProvider - Optional token provider for authentication
 * @param params.axiosOptions - Optional Axios configuration options
 * @param params.tokenHeader - Header name for authentication token (default: "Authorization")
 * @returns CQRS client with response key transformation
 * @example
 * ```typescript
 * const client = mkUncapitalizedCqrsClient({
 *   cqrsEndpoint: 'https://api.example.com'
 * });
 * ```
 */
export function mkUncapitalizedCqrsClient(params: MkCqrsClientParameters) {
    const baseClient = mkCqrsClient(params)

    return {
        ...baseClient,
        createQuery<TQuery, TResult>(type: string) {
            const query = baseClient.createQuery<TQuery, TResult>(type)
            return (dto: TQuery) => query(dto).then(uncapitalizeResponse)
        },
        createOperation<TOperation, TResult>(type: string) {
            const operation = baseClient.createOperation<TOperation, TResult>(type)
            return (dto: TOperation) => operation(dto).then(uncapitalizeResponse)
        },
    }
}
