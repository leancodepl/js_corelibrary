import { act, renderHook } from "@testing-library/react"
import { ConnectStatus } from "../src/lib/enums"
import { getUrlParams } from "../src/lib/urlParams"
import { useConnectToHost } from "../src/lib/useConnectToHost"

vi.mock("../src/lib/connect", () => ({
  connectToHost: vi.fn(() => ({
    promise: Promise.resolve({}),
    destroy: vi.fn(),
  })),
}))

vi.mock("../src/lib/urlParams", () => ({
  getUrlParams: vi.fn(),
}))

describe("useConnectToHost", () => {
  const originalParent = globalThis.window.parent
  const methods = {}

  beforeEach(() => {
    Object.defineProperty(globalThis.window, "parent", {
      value: { postMessage: vi.fn() },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis.window, "parent", {
      value: originalParent,
      writable: true,
      configurable: true,
    })
  })

  it("sets INCOMPATIBLE and does not call connectToHost when host version is incompatible", async () => {
    vi.mocked(getUrlParams).mockReturnValue({ contractVersion: "0.9.0" } as ReturnType<typeof getUrlParams>)

    const { result } = renderHook(() =>
      useConnectToHost({
        methods,
        contractVersion: "1.0.0",
        contractVersionRange: ">=1.0.0",
      }),
    )

    await act(async () => {
      await new Promise(r => setTimeout(r, 0))
    })

    expect(result.current).toMatchObject({
      status: ConnectStatus.INCOMPATIBLE,
      hostVersion: "0.9.0",
      remoteVersion: "1.0.0",
    })
  })

  it("connects when versions are compatible", async () => {
    vi.mocked(getUrlParams).mockReturnValue({ contractVersion: "1.0.0" } as ReturnType<typeof getUrlParams>)

    const { result } = renderHook(() =>
      useConnectToHost({
        methods,
        contractVersion: "1.0.0",
        contractVersionRange: ">=1.0.0",
      }),
    )

    await act(async () => {
      await new Promise(r => setTimeout(r, 0))
    })

    expect(result.current.status).not.toBe(ConnectStatus.IDLE)
    expect(result.current.status).not.toBe(ConnectStatus.INCOMPATIBLE)
  })
})
