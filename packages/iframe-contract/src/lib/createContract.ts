import { createConnectToHostProvider } from "./ConnectToHostProvider"
import { HostMethodsBase, RemoteMethodsBase, RemoteParamsBase, RemoteParamsWithContractVersion } from "./types"
import { parseUrlParams } from "./urlParams"
import { useConnectToHost, UseConnectToHostOptions } from "./useConnectToHost"
import { useConnectToRemote, UseConnectToRemoteOptions } from "./useConnectToRemote"
import { defaultIsVersionCompatible } from "./version"

export type CreateContractOptions = {
  /** Contract version for compatibility checking between host and remote */
  contractVersion: string
  /** Custom version compatibility check. Defaults to semver major match. */
  isVersionCompatible?: (hostVersion: string, remoteVersion: string) => boolean
}

/**
 * Create a type-safe contract shared between host and remote.
 * Use the same contract type on both sides to ensure method signatures match.
 *
 * @example
 * // Define contract in a shared package or file
 * type HostMethods = { navigateTo: (path: string) => Promise<void>; ... }
 * type RemoteMethods = { getCurrentPath: () => Promise<string>; ... }
 * type RemoteParams = { userId?: string; tenantId?: string }
 *
 * export const contract = createContract<
 *   HostMethods,
 *   RemoteMethods,
 *   RemoteParams
 * >({ contractVersion: '1.0.0' })
 *
 * // Host: contract.useConnectToRemote({ remoteUrl, params: { userId: '123' }, methods })
 * // Remote: contract.useConnectToHost({ methods, incompatibleVersionHandler })
 * // Remote: contract.parseUrlParams() // { userId?: string; tenantId?: string }
 */
export function createContract<
  THost extends HostMethodsBase,
  TRemote extends RemoteMethodsBase,
  TParams extends RemoteParamsBase,
>(options: CreateContractOptions) {
  type TParamsWithContractVersion = RemoteParamsWithContractVersion<TParams>

  const { contractVersion, isVersionCompatible = defaultIsVersionCompatible } = options

  const { ConnectToHostProvider, useConnectToHostContext } = createConnectToHostProvider<
    THost,
    TRemote,
    TParamsWithContractVersion
  >(contractVersion, isVersionCompatible)

  const useWrappedConnectToRemote = (options: Omit<UseConnectToRemoteOptions<THost, TParams>, "contractVersion">) =>
    useConnectToRemote({
      ...options,
      contractVersion,
    })

  const useWrappedConnectToHost = (
    options: Omit<UseConnectToHostOptions<TRemote>, "contractVersion" | "isVersionCompatible">,
  ) =>
    useConnectToHost({
      ...options,
      contractVersion,
      isVersionCompatible,
    })

  return {
    useConnectToRemote: useWrappedConnectToRemote,
    useConnectToHost: useWrappedConnectToHost,
    ConnectToHostProvider,
    useConnectToHostContext,
    parseUrlParams: parseUrlParams as typeof parseUrlParams<TParamsWithContractVersion>,
  }
}
