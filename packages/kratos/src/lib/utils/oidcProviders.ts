import { ComponentType, ReactNode } from "react"

export type OidcProviderConfig = {
  id: string
  label?: string
}

export type OidcProvidersConfig = readonly OidcProviderConfig[]

/**
 * Transforms OIDC provider config array into a typed object with capitalized provider IDs as keys
 * @example
 * type Config = [{ id: "google" }, { id: "microsoft" }]
 * type Components = OidcProviderComponents<Config>
 * // Result: { Google?: ComponentType<...>, Microsoft?: ComponentType<...> }
 */
export type OidcProviderComponents<TOidcProvidersConfig extends OidcProvidersConfig> = {
  [K in Capitalize<TOidcProvidersConfig[number]["id"]>]?: ComponentType<{ children: ReactNode }>
}
