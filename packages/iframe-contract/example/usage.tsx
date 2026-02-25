import React, { useCallback, useMemo, useState } from "react"
import { ConnectToHostProvider, parseUrlParams, useConnectToHostContext, useConnectToRemote } from "./contract"
import { ImplantMethods, ThemeValue } from "./types"

export const HostComponent = () => {
  const [currentPath, setCurrentPath] = useState("/dashboard")
  const [userId, setUserId] = useState<string | null>("user-42")
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: string }>>([])
  const [nextNotificationId, setNextNotificationId] = useState(0)

  const methods = useMemo(
    () => ({
      onRouteChange: (path: string): Promise<void> => (setCurrentPath(path), Promise.resolve()),
      navigateTo: (path: string): Promise<void> => (setCurrentPath(path), Promise.resolve()),
      invalidateToken: (): Promise<boolean> => (setUserId(null), Promise.resolve(true)),
      showNotification: (message: string, type?: "error" | "info" | "success" | "warning"): Promise<void> => (
        setNotifications(prev => [...prev, { id: nextNotificationId, message, type: type ?? "info" }]),
        setNextNotificationId(id => id + 1),
        Promise.resolve()
      ),
      getCurrentUserId: (): Promise<string | null> => Promise.resolve(userId),
    }),
    [userId, nextNotificationId],
  )

  const { iframe, remote, isConnected } = useConnectToRemote({
    remoteUrl: "https://example.com",
    iframeProps: {
      title: "Embedded Settings",
    },
    params: {
      userId: userId ?? "anonymous",
      theme: "dark",
    },
    methods,
  })

  const handleSyncTheme = useCallback(async () => {
    if (remote) await remote.onThemeChange("dark")
  }, [remote])

  const handleRefreshImplant = useCallback(async () => {
    if (remote) await remote.refresh()
  }, [remote])

  return (
    <div>
      <header>
        <span>Host path: {currentPath}</span>
        <span>User: {userId ?? "—"}</span>
        {isConnected && (
          <>
            <button onClick={handleSyncTheme}>Sync theme to dark</button>
            <button onClick={handleRefreshImplant}>Refresh implant</button>
          </>
        )}
      </header>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            [{n.type}] {n.message}
          </li>
        ))}
      </ul>
      {iframe}
    </div>
  )
}

export const ImplantComponent = () => {
  const [path, setPath] = useState("/settings")
  const [theme, setTheme] = useState<ThemeValue>("light")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const methods = useMemo<ImplantMethods>(
    () => ({
      getCurrentPath: () => Promise.resolve(path),
      onRouteChange: (newPath: string): Promise<void> => (setPath(newPath), Promise.resolve()),
      navigateTo: (newPath: string): Promise<void> => (setPath(newPath), Promise.resolve()),
      refresh: (): Promise<void> => (setRefreshTrigger(t => t + 1), Promise.resolve()),
      onThemeChange: (newTheme: ThemeValue): Promise<void> => (setTheme(newTheme), Promise.resolve()),
    }),
    [path],
  )

  const handleIncompatibleVersion = useCallback((hostVersion: string, remoteVersion: string): void => {
    console.error(`Version mismatch: host ${hostVersion}, remote ${remoteVersion}`)
  }, [])

  return (
    <ConnectToHostProvider incompatibleVersionHandler={handleIncompatibleVersion} methods={methods}>
      <ImplantChildComponent refreshTrigger={refreshTrigger} theme={theme} />
    </ConnectToHostProvider>
  )
}

const ImplantChildComponent = ({ refreshTrigger, theme }: { refreshTrigger: number; theme: ThemeValue }) => {
  const params = useMemo(() => parseUrlParams(), [])
  const { host, isConnected } = useConnectToHostContext()

  const handleSave = useCallback(async () => {
    if (host) await host.showNotification("Settings saved", "success")
  }, [host])

  const handleLogout = useCallback(async () => {
    if (host) {
      const ok = await host.invalidateToken()
      if (ok) console.warn("Token invalidated")
    }
  }, [host])

  const handleNavigateToProfile = useCallback(async () => {
    if (host) await host.navigateTo("/profile")
  }, [host])

  return (
    <div data-theme={theme}>
      <p>Contract version: {params.contractVersion}</p>
      <p>User ID from params: {params.userId}</p>
      <p>Theme from params: {params.theme}</p>
      <p>Current theme: {theme}</p>
      <p>Refresh count: {refreshTrigger}</p>
      {isConnected && (
        <div>
          <button onClick={handleSave}>Save (notify host)</button>
          <button onClick={handleLogout}>Logout (invalidate token)</button>
          <button onClick={handleNavigateToProfile}>Navigate to profile</button>
        </div>
      )}
    </div>
  )
}
