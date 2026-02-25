import { createContract } from "../src/lib/createContract"

describe("createContract", () => {
  it("returns object with useConnectToRemote, useConnectToHost, ConnectToHostProvider, useConnectToHostContext, parseUrlParams", () => {
    const contract = createContract({
      contractVersion: "1.0.0",
      contractVersionRange: ">=1.0.0 <2.0.0",
    })

    expect(contract).toHaveProperty("useConnectToRemote")
    expect(contract).toHaveProperty("useConnectToHost")
    expect(contract).toHaveProperty("ConnectToHostProvider")
    expect(contract).toHaveProperty("useConnectToHostContext")
    expect(contract).toHaveProperty("parseUrlParams")

    expect(typeof contract.useConnectToRemote).toBe("function")
    expect(typeof contract.useConnectToHost).toBe("function")
    expect(typeof contract.ConnectToHostProvider).toBe("function")
    expect(typeof contract.useConnectToHostContext).toBe("function")
    expect(typeof contract.parseUrlParams).toBe("function")
  })

  it("parseUrlParams parses URL params", () => {
    const contract = createContract({
      contractVersion: "1.0.0",
      contractVersionRange: ">=1.0.0",
    })

    const result = contract.parseUrlParams("?userId=123")
    expect(result).toEqual({ userId: "123" })
  })
})
