/**
 * Methods exposed by the host (parent) window to the remote (child iframe).
 * Remote calls these to request actions from host.
 */
export type HostMethods = {
  // Routing
  onRouteChange: (path: string) => Promise<void>
  navigateTo: (path: string) => Promise<void>

  // Authentication
  invalidateToken: () => Promise<boolean>

  // Other
  showNotification: (message: string, type?: "error" | "info" | "success" | "warning") => Promise<void>
  getCurrentUserId: () => Promise<string | null>
}

/**
 * Methods exposed by the remote (child iframe) to the host (parent) window.
 * Host calls these to control or query the remote.
 */
export type ThemeValue = "dark" | "light"

export type RemoteMethods = {
  // Routing
  onRouteChange: (path: string) => Promise<void>
  navigateTo: (path: string) => Promise<void>

  // Other
  getCurrentPath: () => Promise<string>
  refresh: () => Promise<void>
  onThemeChange: (theme: ThemeValue) => Promise<void>
}

export type RemoteParams = {
  userId: string
  theme: string
}
