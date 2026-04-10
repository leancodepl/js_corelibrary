import { createContract } from "../src/lib/createContract"
import { installLocationMock, setLocationSearch } from "./urlParams.spec"

describe("createContract", () => {
  installLocationMock()
  it("returns object with useConnectToRemote, useConnectToHost, ConnectToHostProvider, useConnectToHostContext, getUrlParams", () => {
    const contract = createContract({
      contractVersion: "1.0.0",
      contractVersionRange: ">=1.0.0 <2.0.0",
    })

    expect(contract).toHaveProperty("useConnectToRemote")
    expect(contract).toHaveProperty("useConnectToHost")
    expect(contract).toHaveProperty("ConnectToHostProvider")
    expect(contract).toHaveProperty("useConnectToHostContext")
    expect(contract).toHaveProperty("getUrlParams")

    expect(typeof contract.useConnectToRemote).toBe("function")
    expect(typeof contract.useConnectToHost).toBe("function")
    expect(typeof contract.ConnectToHostProvider).toBe("function")
    expect(typeof contract.useConnectToHostContext).toBe("function")
    expect(typeof contract.getUrlParams).toBe("function")
  })

  it("getUrlParams reads URL params from location", () => {
    const contract = createContract({
      contractVersion: "1.0.0",
      contractVersionRange: ">=1.0.0",
    })

    setLocationSearch("?userId=123")
    const result = contract.getUrlParams()
    expect(result).toEqual({ userId: "123" })
  })
})
