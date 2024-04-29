export type TokenProvider = {
    getToken: () => Promise<string | undefined>;
    invalidateToken: () => Promise<boolean>;
};

export type ValidationError<TErrorCodes extends Record<string, number>> = {
    readonly PropertyName: string;
    readonly ErrorMessage: string;
    readonly AttemptedValue: unknown;
    readonly ErrorCode: TErrorCodes[keyof TErrorCodes];
};

export type CommandResult<TErrorCodes extends Record<string, number>> =
    | {
          readonly WasSuccessful: false;
          readonly ValidationErrors: ValidationError<TErrorCodes>[];
      }
    | {
          readonly WasSuccessful: true;
      };

export type ApiSuccess<TResult> = {
    readonly isSuccess: true;
    readonly result: TResult;
};

export type ApiError = {
    readonly isSuccess: false;
    readonly error: any;
};

export type ApiResponse<TResult> = ApiError | ApiSuccess<TResult>;
