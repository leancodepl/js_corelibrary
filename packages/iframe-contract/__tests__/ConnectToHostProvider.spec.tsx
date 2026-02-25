import { render, screen } from "@testing-library/react"
import { createConnectToHostProvider } from "../src/lib/ConnectToHostProvider"
import { ConnectStatus } from "../src/lib/enums"

vi.mock("../src/lib/connect", () => ({
  connectToHost: vi.fn(() => ({
    promise: Promise.resolve({}),
    destroy: vi.fn(),
  })),
}))

vi.mock("../src/lib/urlParams", () => ({
  parseUrlParams: vi.fn(() => ({ contractVersion: "1.0.0" })),
}))

const { ConnectToHostProvider, useConnectToHostContext } = createConnectToHostProvider("1.0.0", ">=1.0.0")

function Inner() {
  const context = useConnectToHostContext()
  return <span data-testid="context">{JSON.stringify(context)}</span>
}

function TestConsumer() {
  return (
    <ConnectToHostProvider incompatibleVersionHandler={() => {}} methods={{}}>
      <Inner />
    </ConnectToHostProvider>
  )
}

function ThrowsOutsideProvider() {
  useConnectToHostContext()
  return null
}

describe("createConnectToHostProvider", () => {
  const originalParent = globalThis.window.parent

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

  it("useConnectToHostContext throws when used outside ConnectToHostProvider", () => {
    expect(() => render(<ThrowsOutsideProvider />)).toThrow(
      "useConnectToHostContext must be used within ConnectToHostProvider",
    )
  })

  it("useConnectToHostContext returns value when used inside ConnectToHostProvider", () => {
    render(<TestConsumer />)
    const el = screen.getByTestId("context")
    const parsed = JSON.parse(el.textContent ?? "{}")
    expect(parsed).toHaveProperty("status")
    expect([ConnectStatus.IDLE, ConnectStatus.CONNECTED, ConnectStatus.ERROR]).toContain(parsed.status)
    if (parsed.status === ConnectStatus.CONNECTED) expect(parsed).toHaveProperty("host")
    if (parsed.status === ConnectStatus.ERROR) expect(parsed).toHaveProperty("error")
  })
})
