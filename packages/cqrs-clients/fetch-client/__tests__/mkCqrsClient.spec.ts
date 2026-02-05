import { mkCqrsClient } from "../src"

const mockFetch = vi.fn()

beforeAll(() => {
  globalThis.fetch = mockFetch
})

beforeEach(() => {
  mockFetch.mockClear()
})

function createMockResponse<T>(status: number, body?: T): Response {
  return {
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

describe("mkCqrsClient", () => {
  type TestQuery = { id: string }
  type TestQueryResult = { Name: string }
  type TestQueryNestedResult = { Name: string; NestedObject: { Value: number } }

  type TestOperation = { value: string }
  type TestOperationResult = { Result: boolean }
  type TestOperationNestedResult = { Result: boolean; Data: { ItemName: string } }

  const testCommandErrorCodes = { InvalidValue: 1 }
  type TestCommandErrorCodes = typeof testCommandErrorCodes
  type TestCommand = { value: string }

  describe("createQuery", () => {
    it("should make a POST request to correct endpoint", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      await query({ id: "123" })

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/query/TestQuery",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "123" }),
        }),
      )
    })

    it("should return uncapitalized success response on 200", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryNestedResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, { Name: "Test", NestedObject: { Value: 42 } } satisfies TestQueryNestedResult),
      )

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: true,
        result: { name: "Test", nestedObject: { value: 42 } },
      })
    })

    it("should include authorization header when token provider is present", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("test-token"),
        invalidateToken: vi.fn(),
      }

      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      await query({ id: "123" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
        }),
      )
    })

    it("should use custom token header when specified", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("test-token"),
        invalidateToken: vi.fn(),
      }

      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        tokenProvider,
        tokenHeader: "X-Custom-Auth",
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      await query({ id: "123" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Auth": "Bearer test-token",
          },
        }),
      )
    })

    it("should support abort functionality", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      const promise = query({ id: "123" })

      expect(promise.abort).toBeDefined()
      expect(typeof promise.abort).toBe("function")

      await promise
    })

    it("should return aborted response when request is aborted", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const abortError = new Error("Aborted")
      abortError.name = "AbortError"
      mockFetch.mockRejectedValueOnce(abortError)

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: true,
        error: abortError,
      })
    })

    it("should pass fetch options to request", async () => {
      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        fetchOptions: {
          credentials: "include",
          cache: "no-cache",
        },
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      await query({ id: "123" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: "include",
          cache: "no-cache",
        }),
      )
    })

    it("should allow overriding options per request", async () => {
      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        fetchOptions: { cache: "default" },
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      await query({ id: "123" }, { cache: "no-store" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: "no-store",
        }),
      )
    })
  })

  describe("createOperation", () => {
    it("should make a POST request to correct endpoint", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Result: true } satisfies TestOperationResult))

      await operation({ value: "test" })

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/operation/TestOperation",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ value: "test" }),
        }),
      )
    })

    it("should use no-store cache by default", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { Result: true } satisfies TestOperationResult))

      await operation({ value: "test" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: "no-store",
        }),
      )
    })

    it("should return uncapitalized success response", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const operation = client.createOperation<TestOperation, TestOperationNestedResult>("TestOperation")

      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, { Result: true, Data: { ItemName: "Test" } } satisfies TestOperationNestedResult),
      )

      const result = await operation({ value: "test" })

      expect(result).toEqual({
        isSuccess: true,
        result: { result: true, data: { itemName: "Test" } },
      })
    })
  })

  describe("createCommand", () => {
    it("should make a POST request to correct endpoint", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { WasSuccessful: true }))

      await command({ value: "test" })

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/command/TestCommand",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ value: "test" }),
        }),
      )
    })

    it("should use no-store cache by default", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { WasSuccessful: true }))

      await command({ value: "test" })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: "no-store",
        }),
      )
    })

    it("should return success response for successful command", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      mockFetch.mockResolvedValueOnce(createMockResponse(200, { WasSuccessful: true }))

      const result = await command({ value: "test" })

      expect(result).toEqual({
        isSuccess: true,
        result: { wasSuccessful: true },
      })
    })

    it("should return validation errors on 422", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

      mockFetch.mockResolvedValueOnce(
        createMockResponse(422, {
          WasSuccessful: false,
          ValidationErrors: [{ PropertyName: "Value", ErrorCode: 1, ErrorMessage: "Invalid" }],
        }),
      )

      const result = await command({ value: "test" })

      expect(result).toEqual({
        isSuccess: true,
        result: {
          wasSuccessful: false,
          validationErrors: [{ propertyName: "Value", errorCode: 1, errorMessage: "Invalid" }],
        },
      })
    })

    describe("handle method", () => {
      it("should be available on command", () => {
        const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
        const command = client.createCommand<TestCommand, TestCommandErrorCodes>("TestCommand", testCommandErrorCodes)

        expect(command.handle).toBeDefined()
        expect(typeof command.handle).toBe("function")
      })
    })
  })

  describe("error handling", () => {
    it("should return error for 400 response", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(400))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "The request was malformed",
      })
    })

    it("should return error for 401 without token provider", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(401))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "User needs to be authenticated to execute the command/query/operation",
      })
    })

    it("should retry on 401 when token can be refreshed", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValueOnce("old-token").mockResolvedValueOnce("new-token"),
        invalidateToken: vi.fn().mockResolvedValue(true),
      }

      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch
        .mockResolvedValueOnce(createMockResponse(401))
        .mockResolvedValueOnce(createMockResponse(200, { Name: "Test" } satisfies TestQueryResult))

      const result = await query({ id: "123" })

      expect(tokenProvider.invalidateToken).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        isSuccess: true,
        result: { name: "Test" },
      })
    })

    it("should return error when token refresh fails", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("token"),
        invalidateToken: vi.fn().mockResolvedValue(false),
      }

      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(401))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Cannot refresh access token after the server returned 401 Unauthorized",
      })
    })

    it("should return error after retry still fails with 401", async () => {
      const tokenProvider = {
        getToken: vi.fn().mockResolvedValue("token"),
        invalidateToken: vi.fn().mockResolvedValue(true),
      }

      const client = mkCqrsClient({
        cqrsEndpoint: "https://api.test.com",
        tokenProvider,
      })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValue(createMockResponse(401))

      const result = await query({ id: "123" })

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "The request has not been authorized and token refresh did not help",
      })
    })

    it("should return error for 403 response", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(403))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "User is not authorized to execute the command/query/operation",
      })
    })

    it("should return error for 404 response", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(404))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Command/query/operation not found",
      })
    })

    it("should return error for 500 response", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      mockFetch.mockResolvedValueOnce(createMockResponse(500))

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Cannot execute command/query/operation, server returned a 500 code",
      })
    })

    it("should return error for network failure", async () => {
      const client = mkCqrsClient({ cqrsEndpoint: "https://api.test.com" })
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const networkError = new Error("Network error")
      mockFetch.mockRejectedValueOnce(networkError)

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: networkError,
      })
    })
  })
})
