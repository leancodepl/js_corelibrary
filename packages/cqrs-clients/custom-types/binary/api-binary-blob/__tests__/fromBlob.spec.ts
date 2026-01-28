import { fromBlob } from "../src"

describe("fromBlob", () => {
  it("handles undefined", async () => {
    const blob = await fromBlob(undefined)

    expect(blob).toBeUndefined()
  })

  it("processes text blob", async () => {
    const blob = new Blob(["Many hands make light work."])

    const apiBinary = await fromBlob(blob)

    expect(apiBinary).toBe("TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu")
  })

  it("processes non-text blob", async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3, 4, 5])])

    const apiBinary = await fromBlob(blob)

    expect(apiBinary).toBe("AQIDBAU=")
  })
})
