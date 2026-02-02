import { mkKratos } from "@leancodepl/kratos"
import { environment } from "../../environments/environment"
import { queryClient } from "../query"
import { SessionManager } from "./session"
import { traitsConfig } from "./traits"

const oidcProviders = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
  { id: "facebook", label: "Facebook" },
] as const

const { session, providers, flows } = mkKratos({
  queryClient,
  basePath: environment.authUrl,
  traits: traitsConfig,
  SessionManager,
  oidcProviders,
})

// session
export const sessionManager = session.sessionManager

// providers
export const KratosProviders = providers.KratosProviders

// flows
export const RegistrationFlow = flows.RegistrationFlow
export const LoginFlow = flows.LoginFlow
export const RecoveryFlow = flows.RecoveryFlow
export const SettingsFlow = flows.SettingsFlow
export const VerificationFlow = flows.VerificationFlow
export const useLogout = flows.useLogout

// errors
export { getErrorMessage } from "./errors"

// traits
export type { AuthTraitsConfig } from "./traits"

// oidc providers
export type OidcProvidersConfig = typeof oidcProviders
