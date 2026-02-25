import { connectToHost, connectToRemote } from "../src/lib/connect"

vi.mock("penpal", () => ({
  connect: vi.fn(() => ({
    promise: Promise.resolve({}),
    destroy: vi.fn(),
  })),
  WindowMessenger: vi.fn(),
}))

describe("connectToRemote", () => {
  it("throws when iframe contentWindow is not available", () => {
    const iframe = document.createElement("iframe")
    iframe.src = "https://remote.example.com/app"
    Object.defineProperty(iframe, "contentWindow", { value: null, writable: true })

    expect(() =>
      connectToRemote(iframe, {
        methods: { navigateTo: vi.fn() },
      }),
    ).toThrow("Iframe content window is not available")
  })

  it("creates connection when iframe has contentWindow and src", () => {
    const mockContentWindow = {}
    const iframe = document.createElement("iframe")
    iframe.src = "https://remote.example.com/app"
    Object.defineProperty(iframe, "contentWindow", {
      value: mockContentWindow,
      writable: true,
    })

    const methods = { navigateTo: vi.fn() }
    const connection = connectToRemote(iframe, { methods })

    expect(connection).toHaveProperty("promise")
    expect(connection).toHaveProperty("destroy")
    expect(typeof connection.destroy).toBe("function")
  })
})

describe("connectToHost", () => {
  it("creates connection with default origin from document.referrer", () => {
    const originalReferrer = document.referrer
    Object.defineProperty(document, "referrer", {
      value: "https://host.example.com/page",
      writable: true,
      configurable: true,
    })

    const methods = { getCurrentPath: vi.fn(() => Promise.resolve("/")) }
    const connection = connectToHost({ methods })

    expect(connection).toHaveProperty("promise")
    expect(connection).toHaveProperty("destroy")

    Object.defineProperty(document, "referrer", {
      value: originalReferrer,
      writable: true,
      configurable: true,
    })
  })
})
