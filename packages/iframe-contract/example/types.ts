/**
 * Methods exposed by the admin (parent) window to the implant (child iframe).
 * Implant calls these to request actions from admin.
 */
export type AdminMethods = {
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
 * Methods exposed by the implant (child iframe) to the admin (parent) window.
 * Admin calls these to control or query the implant.
 */
export type ThemeValue = "dark" | "light"

export type ImplantMethods = {
  // Routing
  onRouteChange: (path: string) => Promise<void>
  navigateTo: (path: string) => Promise<void>

  // Other
  getCurrentPath: () => Promise<string>
  refresh: () => Promise<void>
  onThemeChange: (theme: ThemeValue) => Promise<void>
}

export type ImplantParams = {
  userId: string
  theme: string
}
