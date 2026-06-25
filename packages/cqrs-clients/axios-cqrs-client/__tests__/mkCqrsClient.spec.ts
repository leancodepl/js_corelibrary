import { AxiosAdapter, AxiosError, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios"
import { mkCqrsClient } from "../src"

type AdapterResult =
  | { kind: "axiosError"; status?: number; code?: string; data?: unknown }
  | { kind: "response"; status: number; data?: unknown }
  | { kind: "throw"; error: unknown }

/**
 * Builds an axios adapter that resolves/rejects from a queue of programmed
 * results. This lets the real axios instance (with its real request/response
 * interceptors, the unit under test) run end-to-end while we control the HTTP
 * layer. axios itself decides success vs failure based on `validateStatus`, so
 * a "response" with a non-2xx status is converted by axios into an AxiosError
 * with a `.response`, exactly the code path the interceptor handles.
 */
function mkQueuedAdapter(results: AdapterResult[]) {
  const calls: InternalAxiosRequestConfig[] = []

  // Indexed access into `calls` is `T | undefined` under noUncheckedIndexedAccess;
  // this asserts a request was actually captured at the given position.
  function call(index = 0): InternalAxiosRequestConfig {
    const captured = calls[index]
    if (!captured) {
      throw new Error(`no request captured at index ${index}`)
    }
    return captured
  }

  const adapter: AxiosAdapter = config => {
    calls.push(config)
    const next = results.shift()

    if (!next) {
      throw new Error("adapter called more times than programmed")
    }

    if (next.kind === "throw") {
      return Promise.reject(next.error)
    }

    if (next.kind === "axiosError") {
      const response: AxiosResponse | undefined =
        next.status === undefined
          ? undefined
          : {
              status: next.status,
              statusText: "",
              data: next.data,
              headers: {},
              config,
            }

      const error = new AxiosError(
        "request failed",
        next.code ?? "ERR_BAD_RESPONSE",
        config,
        {},
        response,
      )
      return Promise.reject(error)
    }

    const response: AxiosResponse = {
      status: next.status,
      statusText: "OK",
      data: next.data,
      headers: {},
      config,
    }
    return Promise.resolve(response)
  }

  return { adapter, calls, call }
}

function mkClient(results: AdapterResult[], extra?: Partial<Parameters<typeof mkCqrsClient>[0]>) {
  const { adapter, calls, call } = mkQueuedAdapter(results)
  const axiosOptions: CreateAxiosDefaults = { adapter }

  const client = mkCqrsClient({
    cqrsEndpoint: "https://api.test.com",
    axiosOptions,
    ...extra,
  })

  return { client, calls, call }
}

type TestQuery = { id: string }
type TestQueryResult = { Name: string }

type TestOperation = { value: string }
type TestOperationResult = { Result: boolean }

const testCommandErrorCodes = { InvalidValue: 1 }
type TestCommandErrorCodes = typeof testCommandErrorCodes
type TestCommand = { value: string }

describe("mkCqrsClient", () => {
  describe("createQuery", () => {
    it("should POST to the query/<type> endpoint with the dto as body", async () => {
      const { client, calls, call } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(calls).toHaveLength(1)
      expect(call(0).method).toBe("post")
      expect(call(0).url).toBe("query/TestQuery")
      expect(call(0).baseURL).toBe("https://api.test.com")
      expect(call(0).data).toBe(JSON.stringify({ id: "123" }))
    })

    it("should wrap a 200 response in an ApiSuccess without transforming keys", async () => {
      const { client } = mkClient([
        { kind: "response", status: 200, data: { Name: "Test", Nested: { Value: 42 } } },
      ])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      // The base (non-uncapitalized) client preserves the server's casing.
      expect(result).toEqual({
        isSuccess: true,
        result: { Name: "Test", Nested: { Value: 42 } },
      })
    })

    it("should attach a Bearer token from the token provider", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("test-token"),
        invalidateToken: vi.fn(),
      }
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }], {
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(tokenProvider.getToken).toHaveBeenCalledTimes(1)
      expect(call(0).headers.get("Authorization")).toBe("Bearer test-token")
    })

    it("should use a custom token header when configured", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("test-token"),
        invalidateToken: vi.fn(),
      }
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }], {
        tokenProvider,
        tokenHeader: "X-Custom-Auth",
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(call(0).headers.get("X-Custom-Auth")).toBe("Bearer test-token")
      expect(call(0).headers.get("Authorization")).toBeFalsy()
    })

    it("should not attach an auth header when the provider returns no token", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue(undefined),
        invalidateToken: vi.fn(),
      }
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }], {
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(tokenProvider.getToken).toHaveBeenCalledTimes(1)
      expect(call(0).headers.get("Authorization")).toBeFalsy()
    })

    it("should expose an abort function on the returned promise", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const promise = query({ id: "123" })

      expect(typeof promise.abort).toBe("function")

      await promise
    })

    it("should pass an abort signal through to the request", async () => {
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { Name: "Test" } }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(call(0).signal).toBeInstanceOf(AbortSignal)
    })

    it("should report an aborted error when the request is canceled (ERR_CANCELED)", async () => {
      const { client } = mkClient([{ kind: "axiosError", code: "ERR_CANCELED" }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(result.isSuccess).toBe(false)
      if (!result.isSuccess) {
        expect(result.isAborted).toBe(true)
        expect(result.error).toBeInstanceOf(AxiosError)
      }
    })
  })

  describe("createOperation", () => {
    it("should POST to the operation/<type> endpoint", async () => {
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { Result: true } }])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      await operation({ value: "test" })

      expect(call(0).url).toBe("operation/TestOperation")
      expect(call(0).method).toBe("post")
      expect(call(0).data).toBe(JSON.stringify({ value: "test" }))
    })

    it("should wrap the operation result in an ApiSuccess", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { Result: true } }])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      const result = await operation({ value: "test" })

      expect(result).toEqual({ isSuccess: true, result: { Result: true } })
    })

    it("should not expose an abort function (operations are not abortable)", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { Result: true } }])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      const result = (await operation({ value: "test" })) as unknown as { abort?: unknown }

      expect(result.abort).toBeUndefined()
    })
  })

  describe("createCommand", () => {
    it("should POST to the command/<type> endpoint", async () => {
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { WasSuccessful: true } }])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      await command({ value: "test" })

      expect(call(0).url).toBe("command/TestCommand")
      expect(call(0).data).toBe(JSON.stringify({ value: "test" }))
    })

    it("should return an ApiSuccess for a successful command", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { WasSuccessful: true } }])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      const result = await command({ value: "test" })

      expect(result).toEqual({ isSuccess: true, result: { WasSuccessful: true } })
    })

    it("should treat a 422 validation response as a success carrying the raw body", async () => {
      const validationBody = {
        WasSuccessful: false,
        ValidationErrors: [{ PropertyName: "Value", ErrorCode: 1, ErrorMessage: "Invalid" }],
      }
      const { client } = mkClient([{ kind: "axiosError", status: 422, data: validationBody }])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      const result = await command({ value: "test" })

      expect(result).toEqual({ isSuccess: true, result: validationBody })
    })

    it("should expose a handle method", () => {
      const { client } = mkClient([])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      expect(typeof command.handle).toBe("function")
    })

    it("handle should resolve the 'success' branch for a successful command", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { WasSuccessful: true } }])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      const success = vi.fn()
      const failure = vi.fn()
      const invalidValue = vi.fn()

      const handler = await command.handle({ value: "test" })
      handler.handle("success", success).handle("failure", failure).handle("InvalidValue", invalidValue).check()

      expect(success).toHaveBeenCalledTimes(1)
      expect(failure).not.toHaveBeenCalled()
      expect(invalidValue).not.toHaveBeenCalled()
    })

    it("handle should resolve a mapped validation error branch on 422", async () => {
      const validationBody = {
        WasSuccessful: false,
        ValidationErrors: [{ PropertyName: "Value", ErrorCode: 1, ErrorMessage: "Invalid" }],
      }
      const { client } = mkClient([{ kind: "axiosError", status: 422, data: validationBody }])
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      const success = vi.fn()
      const failure = vi.fn()
      const invalidValue = vi.fn()

      const handler = await command.handle({ value: "test" })
      handler.handle("success", success).handle("failure", failure).handle("InvalidValue", invalidValue).check()

      expect(invalidValue).toHaveBeenCalledTimes(1)
      expect(success).not.toHaveBeenCalled()
      expect(failure).not.toHaveBeenCalled()
    })
  })

  describe("error handling", () => {
    async function runQueryWith(result: AdapterResult, extra?: Partial<Parameters<typeof mkCqrsClient>[0]>) {
      const { client } = mkClient([result], extra)
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")
      return query({ id: "123" })
    }

    it("should map 400 to a malformed-request error", async () => {
      const result = await runQueryWith({ kind: "axiosError", status: 400 })

      expect(result).toEqual({ isSuccess: false, isAborted: false, error: "The request was malformed" })
    })

    it("should map 403 to a not-authorized error", async () => {
      const result = await runQueryWith({ kind: "axiosError", status: 403 })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "User is not authorized to execute the command/query/operation",
      })
    })

    it("should map 404 to a not-found error", async () => {
      const result = await runQueryWith({ kind: "axiosError", status: 404 })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Command/query/operation not found",
      })
    })

    it("should map an unhandled status (500) to a generic server error", async () => {
      const result = await runQueryWith({ kind: "axiosError", status: 500 })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Cannot execute command/query/operation, server returned a 500 code",
      })
    })

    it("should map 401 without a token provider to an authentication error", async () => {
      const result = await runQueryWith({ kind: "axiosError", status: 401 })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "User needs to be authenticated to execute the command/query/operation",
      })
    })

    it("should report a network error (AxiosError without a response)", async () => {
      const result = await runQueryWith({ kind: "axiosError" })

      expect(result.isSuccess).toBe(false)
      if (!result.isSuccess) {
        expect(result.isAborted).toBe(false)
        expect(result.error).toBeInstanceOf(AxiosError)
      }
    })

    it("should report an unknown error when a non-AxiosError is thrown", async () => {
      const result = await runQueryWith({ kind: "throw", error: "boom" })

      expect(result).toEqual({ isSuccess: false, isAborted: false, error: "Unknown error boom" })
    })
  })

  describe("401 refresh flow", () => {
    it("should refresh the token and retry once, succeeding on the retry", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValueOnce("old-token").mockResolvedValueOnce("new-token"),
        invalidateToken: vi.fn().mockResolvedValue(true),
      }
      const { client, calls, call } = mkClient(
        [
          { kind: "axiosError", status: 401 },
          { kind: "response", status: 200, data: { Name: "Test" } },
        ],
        { tokenProvider },
      )
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(tokenProvider.invalidateToken).toHaveBeenCalledTimes(1)
      expect(calls).toHaveLength(2)
      // The retried request carries the isRetry marker and a fresh token.
      expect(call(1).params?.isRetry).toBe(true)
      expect(call(1).headers.get("Authorization")).toBe("Bearer new-token")
      expect(result).toEqual({ isSuccess: true, result: { Name: "Test" } })
    })

    it("should give up when the retried request also returns 401", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("token"),
        invalidateToken: vi.fn().mockResolvedValue(true),
      }
      const { client, calls } = mkClient(
        [
          { kind: "axiosError", status: 401 },
          { kind: "axiosError", status: 401 },
        ],
        { tokenProvider },
      )
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(calls).toHaveLength(2)
      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "The request has not been authorized and token refresh did not help",
      })
    })

    it("should report a refresh failure when invalidateToken returns false", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("token"),
        invalidateToken: vi.fn().mockResolvedValue(false),
      }
      const { client, calls } = mkClient([{ kind: "axiosError", status: 401 }], { tokenProvider })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(tokenProvider.invalidateToken).toHaveBeenCalledTimes(1)
      expect(calls).toHaveLength(1)
      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Cannot refresh access token after the server returned 401 Unauthorized",
      })
    })
  })

  it("should forward axiosOptions (e.g. headers) onto the underlying instance", async () => {
    const { adapter, call } = mkQueuedAdapter([{ kind: "response", status: 200, data: { Name: "Test" } }])
    const axiosOptions: CreateAxiosDefaults = { adapter, headers: { "X-App": "test-app" } }
    const client = mkCqrsClient({
      cqrsEndpoint: "https://api.test.com",
      axiosOptions,
    })
    const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

    await query({ id: "123" })

    expect(call(0).headers.get("X-App")).toBe("test-app")
  })
})
