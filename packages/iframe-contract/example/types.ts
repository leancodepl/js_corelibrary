/**
 * Methods exposed by the admin (parent) window to the implant (child iframe).
 * Implant calls these to request actions from admin.
 */
export type AdminMethods = {
  /** Notify host when implant's route changes */
  onRouteChange: (path: string) => Promise<void>
  /** Request admin to navigate to a specific path */
  navigateTo: (path: string) => Promise<void>

  /** Invalidate the token */
  invalidateToken: () => Promise<boolean>

  /** Request admin to show a notification message */
  showNotification: (message: string, type?: "error" | "info" | "success" | "warning") => Promise<void>
  /** Get the current user ID from admin context */
  getCurrentUserId: () => Promise<string | null>
}

/**
 * Methods exposed by the implant (child iframe) to the admin (parent) window.
 * Admin calls these to control or query the implant.
 */
export type ThemeValue = "dark" | "light"

export type ImplantMethods = {
  /** Notify implant when host's route changes */
  onRouteChange: (path: string) => Promise<void>
  /** Request implant to navigate to a specific route */
  navigateTo: (path: string) => Promise<void>

  /** Get the current route/path from implant */
  getCurrentPath: () => Promise<string>
  /** Request implant to refresh its data */
  refresh: () => Promise<void>
  /** Notify implant of host theme change for synchronization */
  onThemeChange: (theme: ThemeValue) => Promise<void>
}

export type ImplantParams = {
  userId: string
  theme: string
}
