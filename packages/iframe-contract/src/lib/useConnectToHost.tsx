import type { Methods, RemoteProxy } from "penpal"
import { useEffect, useState } from "react"
import type { ConnectToHostOptions } from "./connect"
import { connectToHost } from "./connect"

export type UseConnectToHostOptions<TRemote extends Methods> = ConnectToHostOptions<TRemote>

export type UseConnectToHostResult<THost extends Methods> = {
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
export function useConnectToHost<THost extends Methods, TRemote extends Methods>(
  options: UseConnectToHostOptions<TRemote>,
): UseConnectToHostResult<THost> {
  const [host, setHost] = useState<RemoteProxy<THost> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { methods, allowedOrigins } = options

  useEffect(() => {
    if (typeof globalThis.window.parent === "undefined" || globalThis.window.parent === globalThis.window) {
      return
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
  }, [methods, allowedOrigins])

  return {
    host,
    isConnected: host !== null,
    error,
  }
}
