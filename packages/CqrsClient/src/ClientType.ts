// eslint-disable-next-line unused-imports/no-unused-vars-ts
export interface IRemoteQuery<TResult> {}
export interface IRemoteCommand {}

export type ValidationError<TErrorCodes extends { [name: string]: number }> = {
    readonly PropertyName: string;
    readonly ErrorMessage: string;
    readonly AttemptedValue: any;
    readonly ErrorCode: TErrorCodes[keyof TErrorCodes];
};

export type CommandResult<TErrorCodes extends { [name: string]: number }> =
    | {
          readonly WasSuccessful: true;
      }
    | {
          readonly WasSuccessful: false;
          readonly ValidationErrors: ValidationError<TErrorCodes>[];
      };

export type ApiSuccess<TResult> = {
    readonly isSuccess: true;
    readonly result: TResult;
};

export type ApiError = {
    readonly isSuccess: false;
    readonly error: any;
};

export type ApiResponse<TResult> = ApiSuccess<TResult> | ApiError;
