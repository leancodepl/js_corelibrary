import React, { useCallback, useMemo } from "react"
import { ConnectToHostProvider, parseUrlParams, useConnectToHostContext, useConnectToRemote } from "./contract"
import { ImplantMethods, ThemeValue } from "./types"

const HostComponent = () => {
  const { iframe } = useConnectToRemote({
    remoteUrl: "https://example.com",
    iframeProps: {
      title: "Host Component",
    },
    methods: {
      onRouteChange: function (path: string): Promise<void> {
        throw new Error("Function not implemented.")
      },
      navigateTo: function (path: string): Promise<void> {
        throw new Error("Function not implemented.")
      },
      invalidateToken: function (): Promise<boolean> {
        throw new Error("Function not implemented.")
      },
      showNotification: function (message: string, type?: "error" | "info" | "success" | "warning"): Promise<void> {
        throw new Error("Function not implemented.")
      },
      getCurrentUserId: function (): Promise<string | null> {
        throw new Error("Function not implemented.")
      },
    },
  })

  return iframe
}

const ImplantComponent = () => {
  const methods = useMemo<ImplantMethods>(
    () => ({
      getCurrentPath: () => Promise.resolve("path"),
      onRouteChange: function (path: string): Promise<void> {
        throw new Error("Function not implemented.")
      },
      navigateTo: function (path: string): Promise<void> {
        throw new Error("Function not implemented.")
      },
      refresh: function (): Promise<void> {
        throw new Error("Function not implemented.")
      },
      onThemeChange: function (theme: ThemeValue): Promise<void> {
        throw new Error("Function not implemented.")
      },
    }),
    [],
  )

  const handleIncompatibleVersion = useCallback((hostVersion: string, remoteVersion: string): Promise<void> | void => {
    console.error(`Version mismatch: host ${hostVersion}, remote ${remoteVersion}`)
  }, [])

  return (
    <ConnectToHostProvider
      children={undefined}
      incompatibleVersionHandler={handleIncompatibleVersion}
      methods={methods}
    />
  )
}

const ImplantChildComponent = () => {
  const params = useMemo(() => parseUrlParams(), [])
  const { host } = useConnectToHostContext()

  return <div>{params.contractVersion}</div>
}
