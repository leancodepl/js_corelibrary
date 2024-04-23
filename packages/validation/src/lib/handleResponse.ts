import { ApiResponse, CommandResult, ValidationError } from "@leancodepl/cqrs-client-base";
import { handleValidationErrors } from "./handleValidationErrors";

export type SuccessOrFailureMarker = { success: -1; failure: -2 };

export function handleResponse<TErrors extends Record<string, number>>(
    response: ApiResponse<CommandResult<TErrors>>,
    errorCodesMap: TErrors,
) {
    const newErrorCodesMap = {
        ...errorCodesMap,
        success: -1,
        failure: -2,
    } as const;

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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ] as any);

    return handleValidationErrors(validationErrors, newErrorCodesMap);
}
