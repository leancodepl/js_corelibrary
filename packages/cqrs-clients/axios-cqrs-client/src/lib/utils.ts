import { ApiResponse } from "@leancodepl/cqrs-client-base"
import { UncapitalizeDeep, uncapitalizeDeep } from "@leancodepl/utils"

export const returnFunctionCapitalized = function<T, TOut>(data : ApiResponse<T>): ApiResponse<T> {
    return data 
}
export const returnFunctionUncapitalized = function<T, TOut>(data : ApiResponse<T>):UncapitalizeDeep<ApiResponse<T>> {
    return uncapitalizeDeep(data)
}