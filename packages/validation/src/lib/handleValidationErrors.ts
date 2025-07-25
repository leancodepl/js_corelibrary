import { ValidationError } from "@leancodepl/cqrs-client-base"

export type ReducerDescription<THandlerResult, TReturnValue = THandlerResult> = {
    reducer: (prev: TReturnValue, cur: THandlerResult) => TReturnValue
    initialValue: TReturnValue
}

export type SpecificValidationError<
    TErrors extends Record<string, number>,
    TError extends keyof TErrors,
> = ValidationError<Record<TError, TErrors[TError]>>

export type ValidationErrorHandlerFunc<
    TErrorsToHandle extends Record<string, number>,
    THandledErrors extends keyof TErrorsToHandle,
    TResult,
> = (errorName: THandledErrors, error: SpecificValidationError<TErrorsToHandle, THandledErrors>) => TResult

export type ValidationErrorsHandleFunc<TErrorsToHandle extends Record<string, number>, TInResult> = {
    <THandledErrors extends keyof TErrorsToHandle, TResult>(
        validationErrors: THandledErrors | THandledErrors[],
        handler: ValidationErrorHandlerFunc<TErrorsToHandle, THandledErrors, TResult>,
    ): ValidationErrorsHandler<Omit<TErrorsToHandle, THandledErrors>, TInResult | TResult>
}

export type ValidationErrorHandlerAllFunc<
    TErrorsToHandle extends Record<string, number>,
    THandledErrors extends keyof TErrorsToHandle,
    TResult,
> = (
    errors: {
        errorName: THandledErrors
        errors: SpecificValidationError<TErrorsToHandle, THandledErrors>[]
    }[],
) => TResult

export type ValidationErrorsHandleAllFunc<TErrorsToHandle extends Record<string, number>, TInResult> = {
    <THandledErrors extends keyof TErrorsToHandle, TResult>(
        validationErrors: THandledErrors | THandledErrors[],
        handler: ValidationErrorHandlerAllFunc<TErrorsToHandle, THandledErrors, TResult>,
    ): ValidationErrorsHandler<Omit<TErrorsToHandle, THandledErrors>, TInResult | TResult>
}

export interface ValidationErrorsHandler<TRemainingErrors extends Record<string, number>, TResult> {
    handle: ValidationErrorsHandleFunc<TRemainingErrors, TResult>
    handleAll: ValidationErrorsHandleAllFunc<TRemainingErrors, TResult>
    check: object extends TRemainingErrors
        ? <TReturnValue = void>(reducer?: ReducerDescription<TResult, TReturnValue>) => TReturnValue
        : unknown
}

/**
 * Creates a validation error handler that processes errors with type-safe error code mapping.
 * 
 * @template TAllErrors - Error codes map type extending Record<string, number>
 * @template TInResult - Type of results accumulated from previous handlers
 * @param validationErrors - Array of validation errors to process
 * @param errorCodesMap - Mapping of error names to numeric codes
 * @param validationResults - Optional array of previous handler results
 * @returns Handler with handle, handleAll, and check methods
 * @example
 * ```typescript
 * const errorCodes = { EmailExists: 1, InvalidEmail: 2 } as const;
 * const errors = [{ ErrorCode: 1, ErrorMessage: 'Email exists', PropertyName: 'Email', AttemptedValue: 'test@example.com' }];
 * 
 * handleValidationErrors(errors, errorCodes)
 *   .handle('EmailExists', () => console.warn('Email already registered'))
 *   .handle('InvalidEmail', () => console.warn('Invalid email format'))
 *   .check();
 * ```
 */
export function handleValidationErrors<TAllErrors extends Record<string, number>, TInResult = never>(
    validationErrors: ValidationError<TAllErrors>[],
    errorCodesMap: TAllErrors,
    validationResults: TInResult[] = [],
): ValidationErrorsHandler<TAllErrors, TInResult> {
    const handle: ValidationErrorsHandleFunc<TAllErrors, TInResult> = <
        THandledErrors extends keyof TAllErrors,
        TResult,
    >(
        validationErrorsToHandle: THandledErrors | THandledErrors[],
        handler: ValidationErrorHandlerFunc<TAllErrors, THandledErrors, TResult>,
    ) => {
        let result: TResult | undefined = undefined

        for (const validationErrorToHandle of Array.isArray(validationErrorsToHandle)
            ? validationErrorsToHandle
            : [validationErrorsToHandle]) {
            const ve = validationErrors.find(
                (ve): ve is SpecificValidationError<TAllErrors, THandledErrors> =>
                    ve.ErrorCode === errorCodesMap[validationErrorToHandle],
            )

            if (ve) {
                result = handler(validationErrorToHandle, ve)
                break
            }
        }

        let nextResult: (TInResult | TResult)[] = validationResults

        if (result !== undefined) {
            nextResult = [...nextResult, result]
        }

        return handleValidationErrors<Omit<TAllErrors, THandledErrors>, TInResult | TResult>(
            validationErrors as any,
            errorCodesMap,
            nextResult,
        )
    }
    const handleAll: ValidationErrorsHandleAllFunc<TAllErrors, TInResult> = <
        THandledErrors extends keyof TAllErrors,
        TResult,
    >(
        _validationErrorsToHandle: THandledErrors | THandledErrors[],
        handler: ValidationErrorHandlerAllFunc<TAllErrors, THandledErrors, TResult>,
    ) => {
        let result: TResult | undefined = undefined

        const validationErrorsToHandle = Array.isArray(_validationErrorsToHandle)
            ? _validationErrorsToHandle
            : [_validationErrorsToHandle]

        const foundErrors = validationErrorsToHandle.reduce(
            (prev, cur) => {
                const ves = validationErrors.filter(
                    (ve): ve is SpecificValidationError<TAllErrors, THandledErrors> =>
                        ve.ErrorCode === errorCodesMap[cur],
                )

                if (ves.length === 0) {
                    return prev
                }

                return [
                    ...prev,
                    {
                        errorName: cur,
                        errors: ves,
                    },
                ]
            },
            [] as {
                errorName: THandledErrors
                errors: SpecificValidationError<TAllErrors, THandledErrors>[]
            }[],
        )

        if (foundErrors.length > 0) {
            result = handler(foundErrors)
        }

        let nextResult: (TInResult | TResult)[] = validationResults

        if (result !== undefined) {
            nextResult = [...nextResult, result]
        }

        return handleValidationErrors<Omit<TAllErrors, THandledErrors>, TInResult | TResult>(
            validationErrors as any,
            errorCodesMap,
            nextResult,
        )
    }

    return {
        handle,
        handleAll,
        check: (<TReturnValue>(reducer?: ReducerDescription<TInResult, TReturnValue>) => {
            if (reducer) {
                return validationResults.reduce(reducer.reducer, reducer.initialValue)
            }
            return
        }) as any,
    }
}
