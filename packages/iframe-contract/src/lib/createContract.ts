import { createConnectToHostProvider } from "./ConnectToHostProvider"
import { HostMethodsBase, RemoteMethodsBase, RemoteParamsBase, RemoteParamsWithContractVersion } from "./types"
import { parseUrlParams } from "./urlParams"
import { useConnectToHost, UseConnectToHostOptions } from "./useConnectToHost"
import { useConnectToRemote, UseConnectToRemoteOptions } from "./useConnectToRemote"

export type CreateContractOptions = {
  /** Semver version of the contract */
  contractVersion: `${number}.${number}.${number}`
  /** Semver range the host contract version must satisfy (e.g. ">=1.0.0", "^2.0.0", "~2.1.0") */
  contractVersionRange: string
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
 * >({ contractVersion: '1.0.0', contractVersionRange: '>=1.0.0 <2.0.0' })
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

  const { contractVersion, contractVersionRange } = options

  const { ConnectToHostProvider, useConnectToHostContext } = createConnectToHostProvider<
    THost,
    TRemote,
    TParamsWithContractVersion
  >(contractVersion, contractVersionRange)

  const useWrappedConnectToRemote = (options: Omit<UseConnectToRemoteOptions<THost, TParams>, "contractVersion">) =>
    useConnectToRemote<TRemote, THost, TParams>({
      ...options,
      contractVersion,
    })

  const useWrappedConnectToHost = (
    options: Omit<UseConnectToHostOptions<TRemote>, "contractVersion" | "contractVersionRange">,
  ) =>
    useConnectToHost<THost, TRemote, TParamsWithContractVersion>({
      ...options,
      contractVersion,
      contractVersionRange,
    })

  return {
    useConnectToRemote: useWrappedConnectToRemote,
    useConnectToHost: useWrappedConnectToHost,
    ConnectToHostProvider,
    useConnectToHostContext,
    parseUrlParams: parseUrlParams as typeof parseUrlParams<TParamsWithContractVersion>,
  }
}
