import { MemoryTokenStorage, SyncLoginManager } from "../src"

function createLoginManager() {
  return new SyncLoginManager(new MemoryTokenStorage(), "", "", "", "")
}

describe("LoginManager", () => {
  it("should build signin request", () => {
    const loginManager = createLoginManager()

    const signInRequest = loginManager.buildSignInRequest("username", "password")

    expect(signInRequest.body).not.toBeNull()
  })
})
