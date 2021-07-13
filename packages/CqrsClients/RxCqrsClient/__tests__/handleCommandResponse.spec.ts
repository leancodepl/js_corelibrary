import { handleResponse } from "@leancode/validation";
import { lastValueFrom, of } from "rxjs";
import { handleCommandResponse, reduceBoolean, reduceObject } from "../src";

const errorCodesMap = {
    Error1: 1,
    Error2: 2,
    Error3: 3,
} as const;

function mkValidationErrorHandler<TErrorCode extends typeof errorCodesMap[keyof typeof errorCodesMap]>(
    ...errorCodes: TErrorCode[]
) {
    return handleResponse(
        {
            isSuccess: true,
            result: {
                ValidationErrors: errorCodes.map(errorCode => ({
                    ErrorCode: errorCode,
                    AttemptedValue: "AtttemptedValue",
                    ErrorMessage: "ErrorMessage",
                    PropertyName: "PropertyName",
                })),
                WasSuccessful: false,
            },
        },
        errorCodesMap,
    );
}
describe("handleCommandResponse", () => {
    it("reduces to boolean correctly", async () => {
        const result = await lastValueFrom(
            of(mkValidationErrorHandler(1)).pipe(
                handleCommandResponse(
                    handler =>
                        handler
                            .handle(["Error1", "Error2", "Error3", "failure"], () => false)
                            .handle("success", () => true).check,
                ),
                reduceBoolean(),
            ),
        );

        expect(result).toBe(false);
    });

    it("reduces to object correctly", async () => {
        const result = await lastValueFrom(
            of(mkValidationErrorHandler(1, 3)).pipe(
                handleCommandResponse(
                    handler =>
                        handler
                            .handle(["Error1", "Error2"], () => ({
                                firstName: "First name too long",
                            }))
                            .handle("Error3", () => ({
                                lastName: "Last name too long",
                            }))
                            .handle("failure", () => ({
                                general: "Please try again later",
                            }))
                            .handle("success", () => ({})).check,
                ),
                reduceObject(),
            ),
        );

        expect(result).toEqual({
            firstName: "First name too long",
            lastName: "Last name too long",
        });
    });
});
