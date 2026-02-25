import { renderHook } from "@testing-library/react"
import { parseUrlParams } from "../src/lib/urlParams"
import { useConnectToHost } from "../src/lib/useConnectToHost"

vi.mock("../src/lib/connect", () => ({
  connectToHost: vi.fn(() => ({
    promise: Promise.resolve({}),
    destroy: vi.fn(),
  })),
}))

vi.mock("../src/lib/urlParams", () => ({
  parseUrlParams: vi.fn(),
}))

describe("useConnectToHost", () => {
  const originalParent = globalThis.window.parent

  beforeEach(() => {
    Object.defineProperty(globalThis.window, "parent", {
      value: { postMessage: vi.fn() },
      writable: true,
      configurable: true,
    })
    vi.mocked(parseUrlParams).mockReturnValue({ contractVersion: "1.0.0" } as never)
  })

  afterEach(() => {
    Object.defineProperty(globalThis.window, "parent", {
      value: originalParent,
      writable: true,
      configurable: true,
    })
  })

  it("calls incompatibleVersionHandler when host version is incompatible", () => {
    vi.mocked(parseUrlParams).mockReturnValue({ contractVersion: "0.9.0" } as never)

    const incompatibleVersionHandler = vi.fn()

    renderHook(() =>
      useConnectToHost({
        methods: {},
        contractVersion: "1.0.0",
        contractVersionRange: ">=1.0.0",
        incompatibleVersionHandler,
      }),
    )

    expect(incompatibleVersionHandler).toHaveBeenCalledWith("0.9.0", "1.0.0")
  })

  it("does not call incompatibleVersionHandler when versions are compatible", () => {
    const incompatibleVersionHandler = vi.fn()

    renderHook(() =>
      useConnectToHost({
        methods: {},
        contractVersion: "1.0.0",
        contractVersionRange: ">=1.0.0",
        incompatibleVersionHandler,
      }),
    )

    expect(incompatibleVersionHandler).not.toHaveBeenCalled()
  })
})
