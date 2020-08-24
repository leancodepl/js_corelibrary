export type ValidationError<
    TErrorCodes extends {
        [name: string]: number;
    }
> = {
    ErrorCode: TErrorCodes[keyof TErrorCodes];
};

export type ReducerDescription<THandlerResult, TReturnValue = THandlerResult> = {
    reducer: (prev: TReturnValue, cur: THandlerResult) => TReturnValue;
    initialValue: TReturnValue;
};

export type ValidationErrorsHandlerFunc<TErrorsToHandle extends { [name: string]: number }, TInResult> = {
    <THandledErrors extends keyof TErrorsToHandle, TResult>(
        validationErrors: THandledErrors | THandledErrors[],
        handler: (error: THandledErrors) => TResult,
    ): ValidationErrorsHandler<Omit<TErrorsToHandle, THandledErrors>, TResult | TInResult>;
};

export interface ValidationErrorsHandler<TRemainingErrors extends { [name: string]: number }, TResult> {
    handle: ValidationErrorsHandlerFunc<TRemainingErrors, TResult>;
    check: unknown extends TRemainingErrors
        ? <TReturnValue = void>(reducer?: ReducerDescription<TResult, TReturnValue>) => TReturnValue
        : unknown;
}

export default function handleValidationErrors<TAllErrors extends { [name: string]: number }, TInResult = never>(
    validationErrors: ValidationError<TAllErrors>[],
    command: { ErrorCodes: TAllErrors },
    validationResults: TInResult[] = [],
): ValidationErrorsHandler<TAllErrors, TInResult> {
    const handle: ValidationErrorsHandlerFunc<TAllErrors, TInResult> = <
        THandledErrors extends keyof TAllErrors,
        TResult
    >(
        validationErrorsToHandle: THandledErrors | THandledErrors[],
        handler: (error: THandledErrors) => TResult,
    ) => {
        let result: TResult | undefined = undefined;

        for (const validationErrorToHandle of Array.isArray(validationErrorsToHandle)
            ? validationErrorsToHandle
            : [validationErrorsToHandle]) {
            if (validationErrors.some(ve => ve.ErrorCode === command.ErrorCodes[validationErrorToHandle])) {
                result = handler(validationErrorToHandle);
                break;
            }
        }

        let nextResult: (TInResult | TResult)[] = validationResults;

        if (result !== undefined) {
            nextResult = [...nextResult, result];
        }

        return handleValidationErrors<Omit<TAllErrors, THandledErrors>, TInResult | TResult>(
            validationErrors as any,
            command,
            nextResult,
        );
    };

    return {
        handle,
        check: (<TReturnValue>(reducer?: ReducerDescription<TInResult, TReturnValue>) => {
            if (reducer) {
                return validationResults.reduce(reducer.reducer, reducer.initialValue);
            }
        }) as any,
    };
}
