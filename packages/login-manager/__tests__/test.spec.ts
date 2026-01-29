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
      expirationDate: new Date(Date.now() - 1000),
    }

    beforeEach(() => {
      localStorage.clear()
      
      storage = new LocalTokenStorage("test_token", "test_refresh", "test_expiry")
      storage.storeToken(mockToken)

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

      let lockHeld = false
      Object.defineProperty(global.navigator, "locks", {
        value: {
          request: jest.fn(async (name: string, options: any, callback?: any) => {
            const actualCallback = typeof options === "function" ? options : callback
            const opts = typeof options === "object" ? options : {}

            if (opts.ifAvailable) {
              if (lockHeld) {
                return await actualCallback(null)
              }
              lockHeld = true
              try {
                return await actualCallback({ name })
              } finally {
                lockHeld = false
              }
            } else {
              while (lockHeld) {
                await new Promise(resolve => setTimeout(resolve, 10))
              }
              lockHeld = true
              try {
                return await actualCallback({ name })
              } finally {
                lockHeld = false
              }
            }
          }),
        },
        configurable: true,
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
      localStorage.clear()
      delete (global.navigator as any).locks
    })

    it("should prevent concurrent token refresh across multiple instances", async () => {
      const manager1 = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")
      const manager2 = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")

      const [result1, result2] = await Promise.all([
        manager1.tryRefreshToken(),
        manager2.tryRefreshToken(),
      ])

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("should work without Web Locks API", async () => {
      delete (global.navigator as any).locks

      const manager = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")
      const result = await manager.tryRefreshToken()

      expect(result).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("should handle failed refresh", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
        } as Response)
      )

      const manager = new SyncLoginManager(storage, "https://api.example.com", undefined, "client1", "openid")
      const result = await manager.tryRefreshToken()

      expect(result).toBe(false)
    })
  })
})
