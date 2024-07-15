import type { ApiResponse } from "@leancodepl/cqrs-client-base"
import { uncapitalizeDeep } from "@leancodepl/utils"
import { type MkCqrsClientParameters, mkCqrsClient } from "./mkCqrsClient"

function uncapitalizeResponse<TResult>(response: ApiResponse<TResult>) {
    if (!response.isSuccess) {
        return response
    }

    return {
        ...response,
        result: uncapitalizeDeep(response.result),
    }
}

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
