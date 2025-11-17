import * as sinon from "sinon"
import { handleValidationErrors, ValidationErrorHandlerAllFunc } from "../src"

const errorCodesMap = {
  Error1: 1,
  Error2: 2,
  Error3: 3,
} as const

function mkError<TErrorCode extends number>(errorCode: TErrorCode) {
  return {
    ErrorCode: errorCode,
    AttemptedValue: "AttemptedValue",
    ErrorMessage: "ErrorMessage",
    PropertyName: "PropertyName",
  }
}

const emptyHandler = () => {}

describe("handleValidationErrors", () => {
  describe("handle", () => {
    it("does not call any validation handler if there are no errors", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)
      const handleThirdError = sinon.spy(emptyHandler)

      handleValidationErrors([], errorCodesMap)
        .handle("Error1", handleFirstError)
        .handle("Error2", handleSecondError)
        .handle("Error3", handleThirdError)
        .check()

      expect(handleFirstError.called).toBeFalsy()
      expect(handleSecondError.called).toBeFalsy()
      expect(handleThirdError.called).toBeFalsy()
    })

    it("calls single validation handler if there is single error", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)
      const handleThirdError = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1)], errorCodesMap)
        .handle("Error1", handleFirstError)
        .handle("Error2", handleSecondError)
        .handle("Error3", handleThirdError)
        .check()

      expect(handleFirstError.called).toBeTruthy()
      expect(handleSecondError.called).toBeFalsy()
      expect(handleThirdError.called).toBeFalsy()
    })

    it("calls multiple validation handlers if there are multiple errors", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
        .handle("Error1", handleFirstError)
        .handle("Error2", handleSecondError)
        .handle("Error3", emptyHandler)
        .check()

      expect(handleFirstError.called).toBeTruthy()
      expect(handleSecondError.called).toBeTruthy()
    })

    it("calls joint validation handler when there is single related error", () => {
      const handleFirstSecondErrors = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1)], errorCodesMap)
        .handle(["Error1", "Error2"], handleFirstSecondErrors)
        .handle("Error3", emptyHandler)
        .check()

      expect(handleFirstSecondErrors.called).toBeTruthy()
    })

    it("calls joint validation handler once when there are multiple related errors", () => {
      const handleFirstSecondErrors = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
        .handle(["Error1", "Error2"], handleFirstSecondErrors)
        .handle("Error3", emptyHandler)
        .check()

      expect(handleFirstSecondErrors.called).toBeTruthy()
      expect(handleFirstSecondErrors.callCount).toBe(1)
    })

    it("calls joint validation handler only with first (most important) validation error", () => {
      const handleFirstSecondErrors = sinon.spy((_error: "Error1" | "Error2") => {})

      handleValidationErrors([mkError(2), mkError(1)], errorCodesMap)
        .handle(["Error1", "Error2"], handleFirstSecondErrors)
        .handle("Error3", emptyHandler)
        .check()

      expect(handleFirstSecondErrors.calledOnceWith("Error1")).toBeTruthy()
    })
  })

  describe("multiple", () => {
    it("does not call any validation handler if there are no errors", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)
      const handleThirdError = sinon.spy(emptyHandler)

      handleValidationErrors([], errorCodesMap)
        .handleAll("Error1", handleFirstError)
        .handleAll("Error2", handleSecondError)
        .handleAll("Error3", handleThirdError)
        .check()

      expect(handleFirstError.called).toBeFalsy()
      expect(handleSecondError.called).toBeFalsy()
      expect(handleThirdError.called).toBeFalsy()
    })

    it("calls single validation handler if there is single error", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)
      const handleThirdError = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1)], errorCodesMap)
        .handleAll("Error1", handleFirstError)
        .handleAll("Error2", handleSecondError)
        .handleAll("Error3", handleThirdError)
        .check()

      expect(handleFirstError.called).toBeTruthy()
      expect(handleSecondError.called).toBeFalsy()
      expect(handleThirdError.called).toBeFalsy()
    })

    it("calls multiple validation handlers if there are multiple errors", () => {
      const handleFirstError = sinon.spy(emptyHandler)
      const handleSecondError = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
        .handleAll("Error1", handleFirstError)
        .handleAll("Error2", handleSecondError)
        .handleAll("Error3", emptyHandler)
        .check()

      expect(handleFirstError.called).toBeTruthy()
      expect(handleSecondError.called).toBeTruthy()
    })

    it("calls joint validation handler when there is single related error", () => {
      const handleFirstSecondErrors = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1)], errorCodesMap)
        .handleAll(["Error1", "Error2"], handleFirstSecondErrors)
        .handleAll("Error3", emptyHandler)
        .check()

      expect(handleFirstSecondErrors.called).toBeTruthy()
    })

    it("calls joint validation handler once when there are multiple related errors", () => {
      const handleFirstSecondErrors = sinon.spy(emptyHandler)

      handleValidationErrors([mkError(1), mkError(2)], errorCodesMap)
        .handleAll(["Error1", "Error2"], handleFirstSecondErrors)
        .handleAll("Error3", emptyHandler)
        .check()

      expect(handleFirstSecondErrors.called).toBeTruthy()
      expect(handleFirstSecondErrors.callCount).toBe(1)
    })

    it("calls joint validation handler with all validation errors in correct order", () => {
      const handleFirstSecondErrors = sinon.spy<
        ValidationErrorHandlerAllFunc<typeof errorCodesMap, "Error1" | "Error2", void>
      >(_errors => {})

      handleValidationErrors([mkError(2), mkError(2), mkError(1)], errorCodesMap)
        .handleAll(["Error1", "Error2"], handleFirstSecondErrors)
        .handleAll("Error3", emptyHandler)
        .check()

      expect(
        handleFirstSecondErrors.calledOnceWith([
          {
            errorName: "Error1",
            errors: [mkError(1)],
          },
          {
            errorName: "Error2",
            errors: [mkError(2), mkError(2)],
          },
        ]),
      ).toBeTruthy()
    })
  })
})
