import { ApiResponse, CommandResult, ValidationError } from "@leancodepl/cqrs-client-base";
import { handleValidationErrors } from "./handleValidationErrors";

export type SuccessOrFailureMarker = { success: -1; failure: -2 }

/**
 * Handles CQRS command responses and transforms them into validation error handlers.
 * 
 * @template TErrors - Error codes map type extending Record<string, number>
 * @param response - API response containing command result
 * @param errorCodesMap - Mapping of error names to numeric codes
 * @returns Validation error handler with success/failure support
 * @example
 * ```typescript
 * const errorCodes = { UserNotFound: 1 } as const;
 * const response = await commandClient.execute(createUserCommand);
 * 
 * handleResponse(response, errorCodes)
 *   .handle('success', () => console.log('User created'))
 *   .handle('failure', () => console.log('Network error'))
 *   .handle('UserNotFound', () => console.log('User not found'))
 *   .check();
 * ```
 */
export function handleResponse<TErrors extends Record<string, number>>(
    response: ApiResponse<CommandResult<TErrors>>,
    errorCodesMap: TErrors,
) {
    const newErrorCodesMap = {
        ...errorCodesMap,
        success: -1,
        failure: -2,
    } as const

    const validationErrors: ValidationError<typeof newErrorCodesMap>[] = response.isSuccess
        ? response.result.WasSuccessful
            ? [
                  {
                      AttemptedValue: "",
                      ErrorMessage: "",
                      PropertyName: "",
                      ErrorCode: -1,
                  },
              ]
            : response.result.ValidationErrors
        : ([
              {
                  AttemptedValue: "",
                  ErrorMessage: "",
                  PropertyName: "",
                  ErrorCode: -2,
              },
               
          ] as any)

    return handleValidationErrors(validationErrors, newErrorCodesMap)
}
