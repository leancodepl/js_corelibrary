import type { RemoteProxy } from "penpal"
import { useEffect, useState } from "react"
import type { ConnectToHostOptions } from "./connect"
import { connectToHost } from "./connect"
import { HostMethodsBase, RemoteMethodsBase, RemoteParamsWithContractVersion } from "./types"
import { parseUrlParams } from "./urlParams"
import { defaultIsVersionCompatible } from "./version"

export type UseConnectToHostOptions<TRemote extends RemoteMethodsBase> = ConnectToHostOptions<TRemote> & {
  /** Remote's contract version for compatibility check */
  contractVersion: string
  /** Called when host and remote versions are incompatible. Skips connection when provided. */
  incompatibleVersionHandler: (hostVersion: string, remoteVersion: string) => Promise<void> | void
  /** Custom version compatibility check. Defaults to semver major match. */
  isVersionCompatible: (hostVersion: string, remoteVersion: string) => boolean
}

export type UseConnectToHostResult<THost extends HostMethodsBase> = {
  /** Resolved host methods when connected, null otherwise */
  host: RemoteProxy<THost> | null
  /** Whether the connection is established */
  isConnected: boolean
  /** Connection error if any */
  error: Error | null
}

/**
 * Connect remote (child iframe) to host (parent window).
 * Call this from the remote app. Does nothing when not embedded in an iframe.
 */
export function useConnectToHost<
  THost extends HostMethodsBase,
  TRemote extends RemoteMethodsBase,
  TParamsWithContractVersion extends RemoteParamsWithContractVersion,
>(options: UseConnectToHostOptions<TRemote>): UseConnectToHostResult<THost> {
  const [host, setHost] = useState<RemoteProxy<THost> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { methods, allowedOrigins, contractVersion, incompatibleVersionHandler, isVersionCompatible } = options

  useEffect(() => {
    if (typeof globalThis.window.parent === "undefined" || globalThis.window.parent === globalThis.window) {
      return
    }

    const params = parseUrlParams<TParamsWithContractVersion>()
    const hostVersion = params.contractVersion

    if (contractVersion !== undefined && hostVersion !== undefined) {
      const isCompatible = (isVersionCompatible ?? defaultIsVersionCompatible)(hostVersion, contractVersion)
      if (!isCompatible) {
        if (incompatibleVersionHandler) {
          incompatibleVersionHandler(hostVersion, contractVersion)
        }
        return
      }
    }

    const connection = connectToHost<THost, TRemote>({
      methods,
      allowedOrigins,
    })

    connection.promise
      .then(proxy => {
        setHost(proxy)
        setError(null)
      })
      .catch(error => {
        setHost(null)
        setError(error instanceof Error ? error : new Error(String(error)))
      })

    return () => {
      setHost(null)
      connection.destroy()
    }
  }, [methods, allowedOrigins, contractVersion, incompatibleVersionHandler, isVersionCompatible])

  return {
    host,
    isConnected: host !== null,
    error,
  }
}
