import { ComponentProps, ComponentType, ReactNode, useCallback, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { useFormErrors } from "../../../hooks"
import { AuthError, getAllOidcProviderUiNodes, getNodeById, getOidcProviderUiNode, OidcProviderComponents, OidcProvidersConfig } from "../../../utils"
import { Submit } from "../../fields"
import { useExistingIdentifierFromFlow, useGetLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Identifier, Oidc, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

type ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = {
  errors: AuthError[]
  isSubmitting: boolean
  isValidating: boolean
  Passkey: ComponentType<{ children: ReactNode }>
  oidcProviders: OidcProviderComponents<TOidcProvidersConfig>
}

type ChooseMethodFormPropsLoadedRefresh<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig> & {
  isRefresh: true
  identifier?: string
  passwordFields?: {
    Password: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
  }
}

type ChooseMethodFormPropsLoaded<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig> & {
  isRefresh?: false
  passwordFields: {
    Identifier: ComponentType<{ children: ReactNode }>
    Password: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
  }
}

export type ChooseMethodFormProps<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = ChooseMethodFormPropsLoaded<TOidcProvidersConfig> | ChooseMethodFormPropsLoadedRefresh<TOidcProvidersConfig>

type ChooseMethodFormWrapperProps<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = {
  chooseMethodForm: ComponentType<ChooseMethodFormProps<TOidcProvidersConfig>>
  oidcProvidersConfig?: TOidcProvidersConfig
  isRefresh: boolean | undefined
  onError?: OnLoginFlowError
  onLoginSuccess?: () => void
}

export function ChooseMethodFormWrapper<TOidcProvidersConfig extends OidcProvidersConfig = readonly []>({
  chooseMethodForm: ChooseMethodForm,
  oidcProvidersConfig,
  isRefresh,
  onError,
  onLoginSuccess,
}: ChooseMethodFormWrapperProps<TOidcProvidersConfig>) {
  const { data: loginFlow } = useGetLoginFlow()
  const passwordForm = usePasswordForm({ onError, onLoginSuccess })
  const formErrors = useFormErrors(passwordForm)
  const existingIdentifier = useExistingIdentifierFromFlow()

  const PasskeyWithFormErrorHandler = useCallback(
    (props: Omit<ComponentProps<typeof Passkey>, "onError">) => <Passkey {...props} onError={onError} />,
    [onError],
  )

  const oidcProviderComponents = useMemo<OidcProviderComponents<TOidcProvidersConfig>>(() => {
    if (!loginFlow) return {}

    const availableProviders = getAllOidcProviderUiNodes(loginFlow.ui.nodes)
    const configuredProviderIds = new Set(oidcProvidersConfig?.map(p => p.id))
    const components: Record<string, ComponentType<{ children: ReactNode }>> = {}

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      
      // Only include providers that are both available in the flow and configured (or all if no config)
      if (!configuredProviderIds || configuredProviderIds.size === 0 || configuredProviderIds.has(providerId)) {
        const providerName = toUpperFirst(providerId)
        
        components[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId}>{children}</Oidc>
        )
      }
    })

    return components as OidcProviderComponents<TOidcProvidersConfig>
  }, [loginFlow, oidcProvidersConfig])

  const oidcProviderComponentsForRefresh = useMemo<OidcProviderComponents<TOidcProvidersConfig>>(() => {
    if (!loginFlow || !isRefresh) return {}

    const configuredProviderIds = new Set(oidcProvidersConfig?.map(p => p.id))
    const components: Record<string, ComponentType<{ children: ReactNode }>> = {}

    getAllOidcProviderUiNodes(loginFlow.ui.nodes).forEach(node => {
      const providerId = node.attributes.value
      
      // Only include providers that are both available in the flow and configured (or all if no config)
      if ((!configuredProviderIds || configuredProviderIds.size === 0 || configuredProviderIds.has(providerId)) && 
          getOidcProviderUiNode(loginFlow.ui.nodes, providerId)) {
        const providerName = toUpperFirst(providerId)
        
        components[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId}>{children}</Oidc>
        )
      }
    })

    return components as OidcProviderComponents<TOidcProvidersConfig>
  }, [loginFlow, isRefresh, oidcProvidersConfig])

  if (!loginFlow) return null

  return (
    <ChooseMethodFormProvider passwordForm={passwordForm}>
      <form
        onSubmit={e => {
          e.preventDefault()
          passwordForm.handleSubmit()
        }}>
        {isRefresh ? (
          <ChooseMethodForm
            isRefresh
            errors={formErrors}
            identifier={existingIdentifier}
            isSubmitting={passwordForm.state.isSubmitting}
            isValidating={passwordForm.state.isValidating}
            oidcProviders={oidcProviderComponentsForRefresh}
            Passkey={getNodeById(loginFlow.ui.nodes, "passkey_login") ? PasskeyWithFormErrorHandler : (() => null)}
            passwordFields={
              getNodeById(loginFlow.ui.nodes, "password")
                ? {
                    Password,
                    Submit,
                  }
                : undefined
            }
          />
        ) : (
          <ChooseMethodForm
            errors={formErrors}
            isSubmitting={passwordForm.state.isSubmitting}
            isValidating={passwordForm.state.isValidating}
            oidcProviders={oidcProviderComponents}
            Passkey={PasskeyWithFormErrorHandler}
            passwordFields={{
              Identifier,
              Password,
              Submit,
            }}
          />
        )}
      </form>
    </ChooseMethodFormProvider>
  )
}
