import { render, screen } from "@testing-library/react"
import { useConnectToRemote } from "../src/lib/useConnectToRemote"

vi.mock("../src/lib/connect", () => ({
  connectToRemote: vi.fn(() => ({
    promise: Promise.resolve({}),
    destroy: vi.fn(),
  })),
}))

function TestComponent() {
  const { iframe, remote, isConnected, error } = useConnectToRemote({
    remoteUrl: "https://remote.example.com",
    contractVersion: "1.0.0",
    methods: { navigateTo: () => {} },
    iframeProps: { title: "Remote app" },
  })

  return (
    <div>
      <div data-testid="remote">{remote ? "connected" : "disconnected"}</div>
      <div data-testid="isConnected">{String(isConnected)}</div>
      <div data-testid="error">{error?.message ?? "none"}</div>
      {iframe}
    </div>
  )
}

describe("useConnectToRemote", () => {
  it("renders iframe with correct src including params", () => {
    render(<TestComponent />)
    const iframe = screen.getByTitle("Remote app")
    const src = iframe.getAttribute("src")
    expect(src).toBeTruthy()
    expect(src).toContain("https://remote.example.com")
    expect(src).toContain("contractVersion=1.0.0")
  })

  it("includes custom params in iframe src", () => {
    function WithParams() {
      const { iframe } = useConnectToRemote({
        remoteUrl: "https://remote.example.com",
        contractVersion: "1.0.0",
        params: { userId: "123", theme: "dark" },
        methods: { navigateTo: () => {} },
        iframeProps: { title: "Remote" },
      })
      return iframe
    }
    render(<WithParams />)
    const iframe = screen.getByTitle("Remote")
    const src = iframe.getAttribute("src") ?? ""
    expect(src).toContain("userId=123")
    expect(src).toContain("theme=dark")
  })
})
