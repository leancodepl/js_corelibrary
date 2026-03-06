import { useEffect, useRef, useState } from "react"
import semver from "semver"
import type { ConnectToHostOptions } from "./connect"
import { connectToHost } from "./connect"
import { ConnectStatus } from "./enums"
import { HostMethodsBase, HostProxy, RemoteMethodsBase, RemoteParamsWithContractVersion } from "./types"
import { getUrlParams } from "./urlParams"

export type UseConnectToHostOptions<TRemote extends RemoteMethodsBase> = ConnectToHostOptions<TRemote> & {
  /** Remote's semver contract version */
  contractVersion: string
  /** Semver range the host contract version must satisfy (e.g. ">=1.0.0", "^2.0.0", "~2.1.0") */
  contractVersionRange: string
  /** Called when host and remote versions are incompatible. Skips connection when provided. */
  incompatibleVersionHandler: (hostVersion: string, remoteVersion: string) => Promise<void> | void
}

export type ConnectToHostState<THost extends HostMethodsBase> =
  | { status: ConnectStatus.CONNECTED; host: HostProxy<THost> }
  | { status: ConnectStatus.ERROR; error: Error }
  | { status: ConnectStatus.IDLE }

export type UseConnectToHostResult<THost extends HostMethodsBase> = ConnectToHostState<THost>

/**
 * Connect remote (child iframe) to host (parent window).
 * Call this from the remote app. Does nothing when not embedded in an iframe.
 */
export function useConnectToHost<
  THost extends HostMethodsBase,
  TRemote extends RemoteMethodsBase,
  TParamsWithContractVersion extends RemoteParamsWithContractVersion,
>(options: UseConnectToHostOptions<TRemote>): UseConnectToHostResult<THost> {
  const { methods, allowedOrigins, contractVersion, contractVersionRange, incompatibleVersionHandler } = options

  const params = useRef(getUrlParams<TParamsWithContractVersion>())

  const [state, setState] = useState<ConnectToHostState<THost>>({ status: ConnectStatus.IDLE })

  useEffect(() => {
    if (typeof globalThis.window.parent === "undefined" || globalThis.window.parent === globalThis.window) {
      return
    }

    const hostVersion = params.current.contractVersion

    const isCompatible = semver.satisfies(hostVersion, contractVersionRange)
    if (!isCompatible) {
      incompatibleVersionHandler(hostVersion, contractVersion)
      return
    }

    const connection = connectToHost<THost, TRemote>({
      methods,
      allowedOrigins,
    })

    connection.promise
      .then(proxy => setState({ status: ConnectStatus.CONNECTED, host: proxy }))
      .catch(error =>
        setState({
          status: ConnectStatus.ERROR,
          error: error instanceof Error ? error : new Error(String(error)),
        }),
      )

    return () => {
      setState({ status: ConnectStatus.IDLE })
      connection.destroy()
    }
  }, [methods, allowedOrigins, contractVersion, contractVersionRange, incompatibleVersionHandler])

  return state
}
