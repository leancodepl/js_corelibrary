import { AxiosAdapter, AxiosError, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios"
import { mkUncapitalizedCqrsClient } from "../src"

type AdapterResult =
  | { kind: "axiosError"; status?: number; code?: string; data?: unknown }
  | { kind: "response"; status: number; data?: unknown }

function mkQueuedAdapter(results: AdapterResult[]) {
  const calls: InternalAxiosRequestConfig[] = []

  // Indexed access is `T | undefined` under noUncheckedIndexedAccess.
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

    if (next.kind === "axiosError") {
      const response: AxiosResponse | undefined =
        next.status === undefined
          ? undefined
          : { status: next.status, statusText: "", data: next.data, headers: {}, config }

      return Promise.reject(new AxiosError("request failed", next.code ?? "ERR_BAD_RESPONSE", config, {}, response))
    }

    return Promise.resolve({ status: next.status, statusText: "OK", data: next.data, headers: {}, config })
  }

  return { adapter, calls, call }
}

function mkClient(results: AdapterResult[]) {
  const { adapter, call } = mkQueuedAdapter(results)
  const axiosOptions: CreateAxiosDefaults = { adapter }
  const client = mkUncapitalizedCqrsClient({ cqrsEndpoint: "https://api.test.com", axiosOptions })
  return { client, call }
}

type TestQuery = { id: string }
type TestQueryResult = { Name: string; Nested: { Value: number } }
type TestOperation = { value: string }
type TestOperationResult = { Result: boolean; Data: { ItemName: string } }

describe("mkUncapitalizedCqrsClient", () => {
  describe("createQuery", () => {
    it("should deeply uncapitalize keys of a successful query result", async () => {
      const { client } = mkClient([{ kind: "response", status: 200, data: { Name: "Test", Nested: { Value: 42 } } }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: true,
        result: { name: "Test", nested: { value: 42 } },
      })
    })

    it("should uncapitalize keys inside arrays", async () => {
      const { client } = mkClient([
        { kind: "response", status: 200, data: { Items: [{ ItemId: 1 }, { ItemId: 2 }] } },
      ])
      const query = client.createQuery<TestQuery, { Items: { ItemId: number }[] }>("TestQuery")

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: true,
        result: { items: [{ itemId: 1 }, { itemId: 2 }] },
      })
    })

    it("should leave an error response untouched (no uncapitalization)", async () => {
      const { client } = mkClient([{ kind: "axiosError", status: 404 }])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      const result = await query({ id: "123" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "Command/query/operation not found",
      })
    })

    it("should still target the query/<type> endpoint", async () => {
      const { client, call } = mkClient([
        { kind: "response", status: 200, data: { Name: "Test", Nested: { Value: 1 } } },
      ])
      const query = client.createQuery<TestQuery, TestQueryResult>("TestQuery")

      await query({ id: "123" })

      expect(call(0).url).toBe("query/TestQuery")
    })
  })

  describe("createOperation", () => {
    it("should deeply uncapitalize keys of a successful operation result", async () => {
      const { client } = mkClient([
        { kind: "response", status: 200, data: { Result: true, Data: { ItemName: "Test" } } },
      ])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      const result = await operation({ value: "test" })

      expect(result).toEqual({
        isSuccess: true,
        result: { result: true, data: { itemName: "Test" } },
      })
    })

    it("should leave an error response untouched", async () => {
      const { client } = mkClient([{ kind: "axiosError", status: 400 }])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      const result = await operation({ value: "test" })

      expect(result).toEqual({
        isSuccess: false,
        isAborted: false,
        error: "The request was malformed",
      })
    })

    it("should target the operation/<type> endpoint", async () => {
      const { client, call } = mkClient([
        { kind: "response", status: 200, data: { Result: true, Data: { ItemName: "Test" } } },
      ])
      const operation = client.createOperation<TestOperation, TestOperationResult>("TestOperation")

      await operation({ value: "test" })

      expect(call(0).url).toBe("operation/TestOperation")
    })
  })

  describe("createCommand", () => {
    it("should be inherited from the base client and target command/<type>", async () => {
      const { client, call } = mkClient([{ kind: "response", status: 200, data: { WasSuccessful: true } }])
      const command = client.createCommand<{ value: string }, { InvalidValue: 1 }>("TestCommand", { InvalidValue: 1 })

      const result = await command({ value: "test" })

      expect(call(0).url).toBe("command/TestCommand")
      // Commands are not uncapitalized by this client; the raw body is preserved.
      expect(result).toEqual({ isSuccess: true, result: { WasSuccessful: true } })
    })
  })
})
