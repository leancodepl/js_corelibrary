import { RemoteParamsWithContractVersion } from "./types"

/**
 * Build remote URL with query parameters.
 * Merges params into the URL, preserving existing search params.
 */
export function buildRemoteUrl(baseUrl: string, params?: RemoteParamsWithContractVersion): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl
  }

  const url = new URL(baseUrl, globalThis.location.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

/**
 * Parse URL search params into a typed object.
 * Call from the remote (iframe) to read params passed by the host.
 */
export function parseUrlParams<TParamsWithContractVersion extends RemoteParamsWithContractVersion>(
  search: string = typeof globalThis.window !== "undefined" ? globalThis.location.search : "",
): TParamsWithContractVersion {
  return Object.fromEntries(new URLSearchParams(search).entries()) as TParamsWithContractVersion
}
