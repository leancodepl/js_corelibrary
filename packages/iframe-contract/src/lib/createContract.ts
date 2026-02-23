import type { Methods } from "penpal"
import { createConnectToHostProvider } from "./ConnectToHostProvider"
import { useConnectParams } from "./useConnectParams"
import { useConnectToHost } from "./useConnectToHost"
import { useConnectToRemote } from "./useConnectToRemote"

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
 * >()
 *
 * // Host: contract.useConnectToRemote({ remoteUrl, params: { userId: '123' }, methods })
 * // Remote: contract.useConnectToHost({ methods })
 * // Remote: contract.useConnectParams() // { userId?: string; tenantId?: string }
 */
export function createContract<
  THost extends Methods,
  TRemote extends Methods,
  TParams extends Record<string, string> = Record<string, string>,
>() {
  const { ConnectToHostProvider, useConnectToHostContext } = createConnectToHostProvider<THost, TRemote>()

  return {
    useConnectToRemote: useConnectToRemote as typeof useConnectToRemote<TRemote, THost, TParams>,

    useConnectToHost: useConnectToHost as typeof useConnectToHost<THost, TRemote>,

    ConnectToHostProvider,

    useConnectToHostContext,

    useConnectParams: useConnectParams as typeof useConnectParams<TParams>,
  }
}
