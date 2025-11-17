import { createContext, ReactNode, useContext, useMemo } from "react"
import { FrontendApi } from "../kratos"

type KratosClientContext = {
  kratosClient: FrontendApi
}

const kratosClientContext = createContext<KratosClientContext | undefined>(undefined)

type KratosClientProviderProps = {
  children: ReactNode
  api: FrontendApi
}

export function useKratosClientContext() {
  const context = useContext(kratosClientContext)

  if (context === undefined) {
    throw new Error("useKratosClientContext must be used within a KratosClientContextProvider")
  }

  return context
}

export function KratosClientProvider({ children, api }: KratosClientProviderProps) {
  const kratosClientContextData = useMemo<KratosClientContext>(() => ({ kratosClient: api }), [api])

  return <kratosClientContext.Provider value={kratosClientContextData}>{children}</kratosClientContext.Provider>
}
