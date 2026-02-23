import { useMemo } from "react"
import { parseUrlParams } from "./urlParams"

/**
 * Parse URL search params in the remote iframe.
 * Use this to read params passed by the host when loading the remote URL.
 *
 * @example
 * type RemoteParams = { userId?: string; tenantId?: string }
 * const params = useConnectParams<RemoteParams>()
 * // params.userId, params.tenantId
 */
export function useConnectParams<TParams extends Record<string, string>>(): TParams {
  return useMemo(() => {
    if (typeof globalThis.window === "undefined") return {} as TParams
    return parseUrlParams<TParams>(globalThis.location.search)
  }, [])
}
