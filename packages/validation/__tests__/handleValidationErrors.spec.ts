import * as sinon from "sinon";
import { handleValidationErrors, ValidationErrorHandlerAllFunc } from "../src";

const errorCodesMap = {
    Error1: 1,
    Error2: 2,
    Error3: 3,
} as const;

function mkError<TErrorCode extends number>(errorCode: TErrorCode) {
    return {
        ErrorCode: errorCode,
        AttemptedValue: "AttemptedValue",
        ErrorMessage: "ErrorMessage",
        PropertyName: "PropertyName",
    };
}

const emptyHandler = () => {};

describe("handleValidationErrors", () => {
    describe("handle", () => {
        it("does not call any validation handler if there are no errors", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);
            const handleError3 = sinon.spy(emptyHandler);

            handleValidationErrors([], errorCodesMap)
                .handle("Error1", handleError1)
                .handle("Error2", handleError2)
                .handle("Error3", handleError3)
                .check();

            expect(handleError1.called).toBeFalsy();
            expect(handleError2.called).toBeFalsy();
            expect(handleError3.called).toBeFalsy();
        });

        it("calls single validation handler if there is single error", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);
            const handleError3 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1)], errorCodesMap)
                .handle("Error1", handleError1)
                .handle("Error2", handleError2)
                .handle("Error3", handleError3)
                .check();

            expect(handleError1.called).toBeTruthy();
            expect(handleError2.called).toBeFalsy();
            expect(handleError3.called).toBeFalsy();
        });

        it("calls multiple validation handlers if there are multiple errors", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
                .handle("Error1", handleError1)
                .handle("Error2", handleError2)
                .handle("Error3", emptyHandler)
                .check();

            expect(handleError1.called).toBeTruthy();
            expect(handleError2.called).toBeTruthy();
        });

        it("calls joint validation handler when there is single related error", () => {
            const handleError1_2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1)], errorCodesMap)
                .handle(["Error1", "Error2"], handleError1_2)
                .handle("Error3", emptyHandler)
                .check();

            expect(handleError1_2.called).toBeTruthy();
        });

        it("calls joint validation handler once when there are multiple related errors", () => {
            const handleError1_2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
                .handle(["Error1", "Error2"], handleError1_2)
                .handle("Error3", emptyHandler)
                .check();

            expect(handleError1_2.called).toBeTruthy();
            expect(handleError1_2.callCount).toBe(1);
        });

        it("calls joint validation handler only with first (most important) validation error", () => {
            const handleError1_2 = sinon.spy((error: "Error1" | "Error2") => {});

            handleValidationErrors([mkError(2), mkError(1)], errorCodesMap)
                .handle(["Error1", "Error2"], handleError1_2)
                .handle("Error3", emptyHandler)
                .check();

            expect(handleError1_2.calledOnceWith("Error1")).toBeTruthy();
        });
    });

    describe("multiple", () => {
        it("does not call any validation handler if there are no errors", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);
            const handleError3 = sinon.spy(emptyHandler);

            handleValidationErrors([], errorCodesMap)
                .handleAll("Error1", handleError1)
                .handleAll("Error2", handleError2)
                .handleAll("Error3", handleError3)
                .check();

            expect(handleError1.called).toBeFalsy();
            expect(handleError2.called).toBeFalsy();
            expect(handleError3.called).toBeFalsy();
        });

        it("calls single validation handler if there is single error", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);
            const handleError3 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1)], errorCodesMap)
                .handleAll("Error1", handleError1)
                .handleAll("Error2", handleError2)
                .handleAll("Error3", handleError3)
                .check();

            expect(handleError1.called).toBeTruthy();
            expect(handleError2.called).toBeFalsy();
            expect(handleError3.called).toBeFalsy();
        });

        it("calls multiple validation handlers if there are multiple errors", () => {
            const handleError1 = sinon.spy(emptyHandler);
            const handleError2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
                .handleAll("Error1", handleError1)
                .handleAll("Error2", handleError2)
                .handleAll("Error3", emptyHandler)
                .check();

            expect(handleError1.called).toBeTruthy();
            expect(handleError2.called).toBeTruthy();
        });

        it("calls joint validation handler when there is single related error", () => {
            const handleError1_2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1)], errorCodesMap)
                .handleAll(["Error1", "Error2"], handleError1_2)
                .handleAll("Error3", emptyHandler)
                .check();

            expect(handleError1_2.called).toBeTruthy();
        });

        it("calls joint validation handler once when there are multiple related errors", () => {
            const handleError1_2 = sinon.spy(emptyHandler);

            handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
                .handleAll(["Error1", "Error2"], handleError1_2)
                .handleAll("Error3", emptyHandler)
                .check();

            expect(handleError1_2.called).toBeTruthy();
            expect(handleError1_2.callCount).toBe(1);
        });

        it("calls joint validation handler with all validation errors in correct order", () => {
            const handleError1_2 = sinon.spy<
                ValidationErrorHandlerAllFunc<typeof errorCodesMap, "Error1" | "Error2", void>
            >(errors => {});

            handleValidationErrors([mkError(2), mkError(2), mkError(1)], errorCodesMap)
                .handleAll(["Error1", "Error2"], handleError1_2)
                .handleAll("Error3", emptyHandler)
                .check();

            expect(
                handleError1_2.calledOnceWith([
                    {
                        errorName: "Error1",
                        errors: [mkError(1)],
                    },
                    {
                        errorName: "Error2",
                        errors: [mkError(2), mkError(2)],
                    },
                ]),
            ).toBeTruthy();
        });
    });
});
