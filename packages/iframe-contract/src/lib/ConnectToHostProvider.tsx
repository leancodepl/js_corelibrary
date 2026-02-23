import type { Methods } from "penpal"
import { createContext, type ReactNode, useContext } from "react"
import { useConnectToHost, type UseConnectToHostOptions, type UseConnectToHostResult } from "./useConnectToHost"

/**
 * Create a typed ConnectToHostProvider and useConnectToHostContext pair.
 * Each contract should call this to get a provider and hook that share the same context.
 */
export function createConnectToHostProvider<THost extends Methods, TRemote extends Methods>() {
  const ConnectToHostContext = createContext<UseConnectToHostResult<THost> | null>(null)

  type ConnectToHostProviderProps = UseConnectToHostOptions<TRemote> & {
    children: ReactNode
  }

  function ConnectToHostProvider({ children, methods, allowedOrigins }: ConnectToHostProviderProps) {
    const value = useConnectToHost<THost, TRemote>({ methods, allowedOrigins })

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
