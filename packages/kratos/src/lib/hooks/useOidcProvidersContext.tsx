import { createContext, ReactNode, useContext } from "react"
import { OidcProviderConfig } from "../utils"

type OidcProvidersContextValue = {
  oidcProviders: readonly OidcProviderConfig[]
}

const OidcProvidersContext = createContext<OidcProvidersContextValue | undefined>(undefined)

export function OidcProvidersProvider({
  children,
  oidcProviders = [],
}: {
  children: ReactNode
  oidcProviders?: readonly OidcProviderConfig[]
}) {
  return <OidcProvidersContext.Provider value={{ oidcProviders }}>{children}</OidcProvidersContext.Provider>
}

export function useOidcProvidersContext() {
  const context = useContext(OidcProvidersContext)
  if (!context) {
    throw new Error("useOidcProvidersContext must be used within OidcProvidersProvider")
  }
  return context
}

export function useOidcProviders() {
  const { oidcProviders } = useOidcProvidersContext()
  return oidcProviders
}
