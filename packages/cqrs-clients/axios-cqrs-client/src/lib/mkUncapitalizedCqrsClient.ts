import { ApiResponse } from "@leancodepl/cqrs-client-base"
import { CqrsClientParameters, mkCqrsClient } from "./mkCqrsClient"
import { uncapitalizeDeep } from "@leancodepl/utils"

function uncapitalizeResponse<TResult>(response: ApiResponse<TResult>) {
    if (response.isSuccess) {
        return {
            ...response,
            result: uncapitalizeDeep(response.result),
        }
    }
    return response
}

export function mkUncapitalizedCqrsClient(params: CqrsClientParameters) {
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
