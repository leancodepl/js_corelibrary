import { lastValueFrom } from "rxjs"
import mock from "xhr-mock"
import { CommandResult } from "@leancodepl/cqrs-client-base"
import { handleCommandResponse, mkCqrsClient, reduceObject } from "../src"
import clientDef from "./sampleContracts/client"
import { Users } from "./sampleContracts/contracts"

function createCommandResponse<TErrorCodes extends Record<string, number>>(
  allErrorCodes: TErrorCodes,
  ...errorCodes: (keyof TErrorCodes)[]
): CommandResult<TErrorCodes> {
  return {
    ValidationErrors: errorCodes.map(errorCode => ({
      ErrorCode: allErrorCodes[errorCode],
      ErrorMessage: "ErrorMessage",
      PropertyName: "PropertyName",
    })),
    WasSuccessful: errorCodes.length === 0,
  }
}

describe("integration", () => {
  beforeEach(() => {
    mock.setup()
  })

  afterEach(() => {
    mock.teardown()
    vi.clearAllMocks()
  })

  it("correctly fetches command response", async () => {
    const client = mkCqrsClient({ cqrsEndpoint: "mock" })
    const api = clientDef(client)
    const response = createCommandResponse(Users.EditUser.ErrorCodes)
    mock.post(/.*\/LeanCode\.ContractsGeneratorV2\.ExampleContracts\.Users\.EditUser/, (req, res) =>
      res.body(response).status(200),
    )

    const result = await lastValueFrom(
      api.Users.EditUser({
        Email: "property",
        SomethingId: "Id",
      }),
    )

    expect(result).toEqual(response)
  })

  it("correctly handles command response on validation error", async () => {
    const client = mkCqrsClient({ cqrsEndpoint: "mock" })
    const api = clientDef(client)
    mock.post(/.*\/LeanCode\.ContractsGeneratorV2\.ExampleContracts\.Users\.EditUser/, (req, res) =>
      res.body(createCommandResponse(Users.EditUser.ErrorCodes, "EmailIsTaken")).status(200),
    )

    const result = await lastValueFrom(
      api.Users.EditUser.handle({
        Email: "property",
        SomethingId: "Id",
      }).pipe(
        handleCommandResponse(
          handler =>
            handler
              .handle("EmailIsTaken", () => ({ emailIsTaken: true }))
              .handle("UserDoesNotExist", () => ({ userDoesNotExist: true }))
              .handle("failure", () => ({ failure: true }))
              .handle("success", () => ({ success: true })).check,
        ),
        reduceObject(),
      ),
    )

    expect(result).toEqual({ emailIsTaken: true })
  })

  it("correctly handles command response on success", async () => {
    const client = mkCqrsClient({ cqrsEndpoint: "mock" })
    const api = clientDef(client)
    mock.post(/.*\/LeanCode\.ContractsGeneratorV2\.ExampleContracts\.Users\.EditUser/, (req, res) =>
      res.body(createCommandResponse(Users.EditUser.ErrorCodes)).status(200),
    )

    const result = await lastValueFrom(
      api.Users.EditUser.handle({
        Email: "property",
        SomethingId: "Id",
      }).pipe(
        handleCommandResponse(
          handler =>
            handler
              .handle("EmailIsTaken", () => ({ emailIsTaken: true }))
              .handle("UserDoesNotExist", () => ({ userDoesNotExist: true }))
              .handle("failure", () => ({ failure: true }))
              .handle("success", () => ({ success: true })).check,
        ),
        reduceObject(),
      ),
    )

    expect(result).toEqual({ success: true })
  })

  it("correctly handles command response on failure", async () => {
    const client = mkCqrsClient({ cqrsEndpoint: "mock" })
    const api = clientDef(client)
    mock.post(/.*\/LeanCode\.ContractsGeneratorV2\.ExampleContracts\.Users\.EditUser/, (req, res) => res.status(500))

    const result = await lastValueFrom(
      api.Users.EditUser.handle({
        Email: "property",
        SomethingId: "Id",
      }).pipe(
        handleCommandResponse(
          handler =>
            handler
              .handle("EmailIsTaken", () => ({ emailIsTaken: true }))
              .handle("UserDoesNotExist", () => ({ userDoesNotExist: true }))
              .handle("failure", () => ({ failure: true }))
              .handle("success", () => ({ success: true })).check,
        ),
        reduceObject(),
      ),
    )

    expect(result).toEqual({ failure: true })
  })
})
