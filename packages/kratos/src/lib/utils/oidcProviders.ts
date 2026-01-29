import { ComponentType, ReactNode } from "react"

export type OidcProviderConfig = {
  id: string
  label?: string
}

export type OidcProvidersConfig = readonly OidcProviderConfig[]

/**
 * Capitalizes the first letter of a string
 * @example Capitalize<"google"> -> "Google"
 */
type Capitalize<T extends string> = T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T

/**
 * Transforms OIDC provider config array into a typed object with capitalized provider IDs as keys
 * @example
 * type Config = [{ id: "google" }, { id: "microsoft" }]
 * type Components = OidcProviderComponents<Config>
 * // Result: { Google?: ComponentType<...>, Microsoft?: ComponentType<...> }
 */
export type OidcProviderComponents<TOidcProvidersConfig extends OidcProvidersConfig> = {
  [K in TOidcProvidersConfig[number]["id"] as Capitalize<K>]?: ComponentType<{ children: ReactNode }>
}
