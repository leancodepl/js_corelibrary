export type ApiResponse =
    | {
          isSuccess: false
          error: unknown
      }
    | {
          isSuccess: true
      }

export type ApiResponseWithResult<TResult> =
    | {
          isSuccess: false
          error: unknown
      }
    | {
          isSuccess: true
          result: TResult
      }
