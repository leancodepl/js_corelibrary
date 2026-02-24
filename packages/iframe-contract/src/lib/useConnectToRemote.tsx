import type { RemoteProxy } from "penpal"
import type { HTMLAttributes, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import type { ConnectToRemoteOptions } from "./connect"
import { connectToRemote } from "./connect"
import { HostMethodsBase, RemoteMethodsBase, RemoteParamsBase, RemoteParamsWithContractVersion } from "./types"
import { buildRemoteUrl } from "./urlParams"

export type UseConnectToRemoteOptions<
  THost extends HostMethodsBase,
  TParams extends RemoteParamsBase,
> = ConnectToRemoteOptions<THost> & {
  /** URL for the remote iframe src (base URL without params) */
  remoteUrl: string
  /** Params to pass to the implant via URL query string */
  params?: TParams
  /** Contract version passed to remote for compatibility check */
  contractVersion: string
  /** Props for the iframe element */
  iframeProps: Omit<HTMLAttributes<HTMLIFrameElement>, "src" | "title"> & { title: string }
}

export type UseConnectToRemoteResult<TRemote extends RemoteMethodsBase> = {
  /** The iframe element to render */
  iframe: ReactNode
  /** Resolved remote methods when connected, null otherwise */
  remote: RemoteProxy<TRemote> | null
  /** Whether the connection is established */
  isConnected: boolean
  /** Connection error if any */
  error: Error | null
}

/**
 * Connects host (parent) to remote (child iframe) and renders the iframe.
 * Call from the host app.
 *
 * @param options - Connection options including remote URL, host methods, and params
 * @returns Object with `iframe` element, `remote` proxy, `isConnected` flag, and `error`
 * @example
 * ```tsx
 * const { iframe, remote, isConnected } = useConnectToRemote({
 *   remoteUrl: "https://implant.example.com",
 *   methods: { navigateTo: (path) => router.navigate(path), ... },
 *   params: { userId: "123", theme: "dark" },
 * })
 * return <div>{iframe}</div>
 * ```
 */
export function useConnectToRemote<
  TRemote extends RemoteMethodsBase,
  THost extends HostMethodsBase,
  TParams extends RemoteParamsBase,
>(options: UseConnectToRemoteOptions<THost, TParams>): UseConnectToRemoteResult<TRemote> {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [remote, setRemote] = useState<RemoteProxy<TRemote> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { remoteUrl, iframeProps, methods, allowedOrigins, params, contractVersion } = options
  const { title, ...restIframeProps } = iframeProps
  const paramsWithContractVersion = {
    ...params,
    contractVersion,
  } as RemoteParamsWithContractVersion<TParams>
  const iframeSrc = buildRemoteUrl(remoteUrl, paramsWithContractVersion)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const connection = connectToRemote<TRemote, THost>(iframe, {
      methods,
      allowedOrigins,
    })

    connection.promise
      .then(proxy => {
        setRemote(proxy)
        setError(null)
      })
      .catch(error => {
        setRemote(null)
        setError(error instanceof Error ? error : new Error(String(error)))
      })

    return () => {
      setRemote(null)
      connection.destroy()
    }
  }, [iframeSrc, methods, allowedOrigins])

  const iframe = <iframe ref={iframeRef} src={iframeSrc} title={title} {...restIframeProps} />

  return {
    iframe,
    remote,
    isConnected: remote !== null,
    error,
  }
}
