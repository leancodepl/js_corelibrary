import { ComponentType, ComponentProps, ReactNode, useCallback, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { useFormErrors, useOidcProviders } from "../../../hooks"
import { AuthError, defaultProviders, getAllOidcProviderUiNodes, getNodeById, getOidcProviderUiNode, OidcProviderComponents, OidcProvidersConfig } from "../../../utils"
import { Submit } from "../../fields"
import { useExistingIdentifierFromFlow, useGetLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Identifier, Oidc, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

type ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig extends OidcProvidersConfig = []> = {
  errors: AuthError[]
  isSubmitting: boolean
  isValidating: boolean
  Passkey: ComponentType<{ children: ReactNode }>
  oidcProviders: OidcProviderComponents<TOidcProvidersConfig>
}

type ChooseMethodFormPropsLoadedRefresh<TOidcProvidersConfig extends OidcProvidersConfig = []> = ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig> & {
  isRefresh: true
  identifier?: string
  passwordFields?: {
    Password: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
  }
}

type ChooseMethodFormPropsLoaded<TOidcProvidersConfig extends OidcProvidersConfig = []> = ChooseMethodFormPropsLoadedBase<TOidcProvidersConfig> & {
  isRefresh?: false
  passwordFields: {
    Identifier: ComponentType<{ children: ReactNode }>
    Password: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
  }
}

export type ChooseMethodFormProps<TOidcProvidersConfig extends OidcProvidersConfig = []> = ChooseMethodFormPropsLoaded<TOidcProvidersConfig> | ChooseMethodFormPropsLoadedRefresh<TOidcProvidersConfig>

type ChooseMethodFormWrapperProps<TOidcProvidersConfig extends OidcProvidersConfig = []> = {
  chooseMethodForm: ComponentType<ChooseMethodFormProps<TOidcProvidersConfig>>
  isRefresh: boolean | undefined
  onError?: OnLoginFlowError
  onLoginSuccess?: () => void
}

export function ChooseMethodFormWrapper<TOidcProvidersConfig extends OidcProvidersConfig = []>({
  chooseMethodForm: ChooseMethodForm,
  isRefresh,
  onError,
  onLoginSuccess,
}: ChooseMethodFormWrapperProps<TOidcProvidersConfig>) {
  const { data: loginFlow } = useGetLoginFlow()
  const passwordForm = usePasswordForm({ onError, onLoginSuccess })
  const formErrors = useFormErrors(passwordForm)
  const existingIdentifier = useExistingIdentifierFromFlow()
  const customOidcProviders = useOidcProviders()

  const PasskeyWithFormErrorHandler = useCallback(
    (props: Omit<ComponentProps<typeof Passkey>, "onError">) => <Passkey {...props} onError={onError} />,
    [onError],
  )

  const oidcProviderComponents = useMemo(() => {
    if (!loginFlow) return {} as OidcProviderComponents<TOidcProvidersConfig>

    const availableProviders = getAllOidcProviderUiNodes(loginFlow.ui.nodes)
    const components: Record<string, ComponentType<{ children: ReactNode }>> = {}

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      const providerName = toUpperFirst(providerId)
      
      components[providerName] = ({ children }: { children: ReactNode }) => (
        <Oidc provider={providerId}>{children}</Oidc>
      )
    })

    return components as OidcProviderComponents<TOidcProvidersConfig>
  }, [loginFlow])

  const oidcProviderComponentsForRefresh = useMemo(() => {
    if (!loginFlow || !isRefresh) return {} as OidcProviderComponents<TOidcProvidersConfig>

    const components: Record<string, ComponentType<{ children: ReactNode }>> = {}

    getAllOidcProviderUiNodes(loginFlow.ui.nodes).forEach(node => {
      const providerId = node.attributes.value
      const providerName = toUpperFirst(providerId)
      
      if (getOidcProviderUiNode(loginFlow.ui.nodes, providerId)) {
        components[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId}>{children}</Oidc>
        )
      }
    })

    return components as OidcProviderComponents<TOidcProvidersConfig>
  }, [loginFlow, isRefresh])

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
            Passkey={getNodeById(loginFlow.ui.nodes, "passkey_login") ? PasskeyWithFormErrorHandler : (() => null)}
            oidcProviders={oidcProviderComponentsForRefresh}
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
            Passkey={PasskeyWithFormErrorHandler}
            oidcProviders={oidcProviderComponents}
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
