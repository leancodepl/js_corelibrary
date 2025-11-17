import { fromRaw, toBlob } from "../src"
import "blob-polyfill" // https://github.com/jsdom/jsdom/issues/2555

describe("toBlob", () => {
  it("handles undefined", () => {
    const blob = toBlob(undefined)

    expect(blob).toBeUndefined()
  })

  it("handles null", () => {
    const blob = toBlob(null)

    expect(blob).toBeUndefined()
  })

  it("processes base64 encoded text", async () => {
    const apiBinary = fromRaw("TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu")

    const blob = toBlob(apiBinary)

    expect(await blob.text()).toBe("Many hands make light work.")
  })

  it("processes base64 encoded non-text data", async () => {
    const apiBinary = fromRaw("AQIDBAU=")

    const blob = toBlob(apiBinary)

    expect([...new Uint8Array(await blob.arrayBuffer())]).toEqual([1, 2, 3, 4, 5])
  })

  it("assigns content type", async () => {
    const apiBinary = fromRaw("AQIDBAU=")

    const blob = toBlob(apiBinary, "image/png")

    expect(blob.type).toBe("image/png")
  })
})
