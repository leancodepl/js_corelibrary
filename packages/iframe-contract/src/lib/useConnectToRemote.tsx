import type { HTMLAttributes, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import type { ConnectToRemoteOptions } from "./connect"
import { connectToRemote } from "./connect"
import { ConnectStatus } from "./enums"
import {
  HostMethodsBase,
  RemoteMethodsBase,
  RemoteParamsBase,
  RemoteParamsWithContractVersion,
  RemoteProxy,
} from "./types"
import { buildRemoteUrl } from "./urlParams"

export type ConnectToRemoteState<TRemote extends RemoteMethodsBase> =
  | { status: ConnectStatus.CONNECTED; remote: RemoteProxy<TRemote> }
  | { status: ConnectStatus.ERROR; error: Error }
  | { status: ConnectStatus.IDLE }

export type UseConnectToRemoteOptions<
  THost extends HostMethodsBase,
  TParams extends RemoteParamsBase,
> = ConnectToRemoteOptions<THost> & {
  /** URL for the remote iframe src (base URL without params) */
  remoteUrl: string
  /** Params to pass to the remote via URL query string */
  params?: TParams
  /** Host's semver contract version */
  contractVersion: string
  /** Props for the iframe element */
  iframeProps: Omit<HTMLAttributes<HTMLIFrameElement>, "src" | "title"> & { title: string }
}

export type UseConnectToRemoteResult<TRemote extends RemoteMethodsBase> = ConnectToRemoteState<TRemote> & {
  /** The iframe element to render */
  iframe: ReactNode
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
 *   remoteUrl: "https://remote.example.com",
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
  const { remoteUrl, iframeProps, methods, allowedOrigins, params, contractVersion } = options
  const { title, ...restIframeProps } = iframeProps

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [state, setState] = useState<ConnectToRemoteState<TRemote>>({ status: ConnectStatus.IDLE })

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
      .then(proxy => setState({ status: ConnectStatus.CONNECTED, remote: proxy }))
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
  }, [iframeSrc, methods, allowedOrigins])

  const iframe = <iframe ref={iframeRef} src={iframeSrc} title={title} {...restIframeProps} />

  return {
    iframe,
    ...state,
  }
}
