export type TokenProvider = {
  getToken: () => Promise<string | undefined>
  invalidateToken: () => Promise<boolean>
}

export type ValidationError<TErrorCodes extends Record<string, number>> = {
  readonly PropertyName: string
  readonly ErrorMessage: string
  readonly ErrorCode: TErrorCodes[keyof TErrorCodes]
}

export type CommandResult<TErrorCodes extends Record<string, number>> =
  | FailedCommandResult<TErrorCodes>
  | SuccessfulCommandResult

export type FailedCommandResult<TErrorCodes extends Record<string, number>> = {
  readonly WasSuccessful: false
  readonly ValidationErrors: ValidationError<TErrorCodes>[]
}

export type SuccessfulCommandResult = {
  readonly WasSuccessful: true
}

export type ApiSuccess<TResult> = {
  readonly isSuccess: true
  readonly result: TResult
}

export type ApiError = {
  readonly isSuccess: false
  readonly error: any
  readonly isAborted?: boolean
}

export type ApiResponse<TResult> = ApiError | ApiSuccess<TResult>
