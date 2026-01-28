import { LocalTokenStorage, MemoryTokenStorage, SyncLoginManager, Token } from "../src"

function createLoginManager() {
  return new SyncLoginManager(new MemoryTokenStorage(), "", "", "", "")
}

describe("LoginManager", () => {
  it("should build signin request", () => {
    const loginManager = createLoginManager()

    const signInRequest = loginManager.buildSignInRequest("username", "password")

    expect(signInRequest.body).not.toBeNull()
  })

  describe("Concurrent token refresh", () => {
    let storage: LocalTokenStorage
    const mockToken: Token = {
      token: "access_token_123",
      refreshToken: "refresh_token_123",
      expirationDate: new Date(Date.now() - 1000), // Expired token
    }

    beforeEach(() => {
      // Clear localStorage
      localStorage.clear()
      
      // Setup storage
      storage = new LocalTokenStorage("test_token", "test_refresh", "test_expiry")
      storage.storeToken(mockToken)

      // Mock fetch to simulate token refresh
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              access_token: "new_access_token",
              refresh_token: "new_refresh_token",
              expires_in: 3600,
            }),
        } as Response)
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
      localStorage.clear()
    })

    it("should prevent concurrent token refresh across multiple instances", async () => {
      const manager1 = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")
      const manager2 = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")

      // Simulate both managers trying to refresh at the same time
      const [result1, result2] = await Promise.all([
        manager1.tryRefreshToken(),
        manager2.tryRefreshToken(),
      ])

      // Both should succeed (one does the refresh, the other waits)
      expect(result1).toBe(true)
      expect(result2).toBe(true)

      // Fetch should only be called once (by the lock holder)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("should handle lock timeout gracefully", async () => {
      const manager = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")

      // Manually set an expired lock
      const expiredLockTime = Date.now() - 11000 // 11 seconds ago (past timeout)
      localStorage.setItem("token_refresh_lock", expiredLockTime.toString())

      // Should be able to acquire lock and refresh
      const result = await manager.tryRefreshToken()

      expect(result).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("should cleanup lock after successful refresh", async () => {
      const manager = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")

      await manager.tryRefreshToken()

      // Lock should be released
      expect(localStorage.getItem("token_refresh_lock")).toBeNull()
    })

    it("should cleanup lock after failed refresh", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
        } as Response)
      )

      const manager = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")

      await manager.tryRefreshToken()

      // Lock should be released even on failure
      expect(localStorage.getItem("token_refresh_lock")).toBeNull()
    })
  })
})
