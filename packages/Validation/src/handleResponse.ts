import handleValidationErrors, { ValidationError } from "./handleValidationErrors";

export type SuccessOrFailureMarker = { success: -1; failure: -2 };

type CommandResult<TErrors extends { [name: string]: number }> =
    | {
          isSuccess: true;
          result:
              | {
                    WasSuccessful: true;
                }
              | {
                    WasSuccessful: false;
                    ValidationErrors: ValidationError<TErrors>[];
                };
      }
    | {
          isSuccess: false;
      };

export default function handleResponse<TErrors extends Record<string, number>>(
    response: CommandResult<TErrors>,
    command: { ErrorCodes: TErrors },
) {
    const newCommand = {
        ErrorCodes: {
            ...command.ErrorCodes,
            success: -1,
            failure: -2,
        },
    } as const;

    const validationErrors: ValidationError<TErrors & SuccessOrFailureMarker>[] = response.isSuccess
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
          ] as any);

    return handleValidationErrors(validationErrors, newCommand);
}
