import { createContext, type ReactNode, useContext } from "react"
import { HostMethodsBase, RemoteMethodsBase, RemoteParamsWithContractVersion } from "./types"
import { useConnectToHost, type UseConnectToHostOptions, type UseConnectToHostResult } from "./useConnectToHost"

/**
 * Create a typed ConnectToHostProvider and useConnectToHostContext pair.
 * Each contract should call this to get a provider and hook that share the same context.
 */
export function createConnectToHostProvider<
  THost extends HostMethodsBase,
  TRemote extends RemoteMethodsBase,
  TParamsWithContractVersion extends RemoteParamsWithContractVersion,
>(contractVersion: string, contractVersionRange: string) {
  const ConnectToHostContext = createContext<UseConnectToHostResult<THost> | null>(null)

  type ConnectToHostProviderProps = UseConnectToHostOptions<TRemote> & {
    children: ReactNode
  }

  function ConnectToHostProvider<
    T extends Omit<ConnectToHostProviderProps, "contractVersion" | "contractVersionRange">,
  >({ children, methods, allowedOrigins, incompatibleVersionHandler }: T) {
    const value = useConnectToHost<THost, TRemote, TParamsWithContractVersion>({
      methods,
      allowedOrigins,
      contractVersion,
      contractVersionRange,
      incompatibleVersionHandler,
    })

    return <ConnectToHostContext.Provider value={value}>{children}</ConnectToHostContext.Provider>
  }

  function useConnectToHostContext(): UseConnectToHostResult<THost> {
    const context = useContext(ConnectToHostContext)
    if (context === null) {
      throw new Error("useConnectToHostContext must be used within ConnectToHostProvider")
    }
    return context
  }

  return { ConnectToHostProvider, useConnectToHostContext }
}
