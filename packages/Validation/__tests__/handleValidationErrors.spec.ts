import sinon from "sinon";
import { handleValidationErrors } from "../src";

const myCommand = {
    ErrorCodes: {
        Error1: 1,
        Error2: 2,
        Error3: 3,
    },
} as const;

const emptyHandler = () => {};
type EmptyHandler = typeof emptyHandler;

describe("handleValidationErrors", () => {
    it("does not call any validation handler if there are no errors", () => {
        const handleError1 = sinon.fake(emptyHandler);
        const handleError2 = sinon.fake(emptyHandler);
        const handleError3 = sinon.fake(emptyHandler);

        handleValidationErrors([], myCommand)
            .handle("Error1", handleError1 as EmptyHandler)
            .handle("Error2", handleError2 as EmptyHandler)
            .handle("Error3", handleError3 as EmptyHandler)
            .check();

        expect(handleError1.called).toBeFalsy();
        expect(handleError2.called).toBeFalsy();
        expect(handleError3.called).toBeFalsy();
    });

    it("calls single validation handler if there is single error", () => {
        const handleError1 = sinon.fake();

        handleValidationErrors([{ ErrorCode: 1 }], myCommand)
            .handle("Error1", handleError1 as EmptyHandler)
            .handle("Error2", emptyHandler)
            .handle("Error3", emptyHandler)
            .check();

        expect(handleError1.called).toBeTruthy();
    });

    it("calls multiple validation handlers if there are multiple errors", () => {
        const handleError1 = sinon.fake();
        const handleError2 = sinon.fake();

        handleValidationErrors([{ ErrorCode: 1 }, { ErrorCode: 2 }], myCommand)
            .handle("Error1", handleError1 as EmptyHandler)
            .handle("Error2", handleError2 as EmptyHandler)
            .handle("Error3", emptyHandler)
            .check();

        expect(handleError1.called).toBeTruthy();
        expect(handleError2.called).toBeTruthy();
    });

    it("calls joint validation handler when there is single related error", () => {
        const handleError1_2 = sinon.fake();

        handleValidationErrors([{ ErrorCode: 1 }], myCommand)
            .handle(["Error1", "Error2"], handleError1_2 as EmptyHandler)
            .handle("Error3", emptyHandler)
            .check();

        expect(handleError1_2.called).toBeTruthy();
    });

    it("calls joint validation handler once when there are multiple related error", () => {
        const handleError1_2 = sinon.fake();

        handleValidationErrors([{ ErrorCode: 1 }, { ErrorCode: 2 }], myCommand)
            .handle(["Error1", "Error2"], handleError1_2 as EmptyHandler)
            .handle("Error3", emptyHandler)
            .check();

        expect(handleError1_2.called).toBeTruthy();
        expect(handleError1_2.callCount).toBe(1);
    });

    it("calls joint validation handler only with first (most important) validation error", () => {
        const handleError1_2 = sinon.fake();

        handleValidationErrors([{ ErrorCode: 2 }, { ErrorCode: 1 }], myCommand)
            .handle(["Error1", "Error2"], handleError1_2 as EmptyHandler)
            .handle("Error3", emptyHandler)
            .check();

        expect(handleError1_2.calledOnceWith("Error1")).toBeTruthy();
    });
});
