import { ComponentType, ReactNode, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { useFormErrors } from "../../../hooks"
import { AuthError, getAllOidcProviderUiNodes, OidcProviderComponents, OidcProvidersConfig, TraitsConfig } from "../../../utils"
import { Submit } from "../../fields"
import { useGetRegistrationFlow } from "../hooks"
import { OnRegistrationFlowError } from "../types"
import { Oidc, TraitCheckbox, TraitInput } from "./fields"
import { TraitsFormProvider } from "./traitsFormContext"
import { useTraitsForm } from "./useTraitsForm"

type TraitsComponents<TTraitsConfig extends TraitsConfig> = {
  [K in keyof TTraitsConfig]: TTraitsConfig[K] extends { type: "string" }
    ? ComponentType<Omit<typeof TraitInput, "trait">>
    : TTraitsConfig[K] extends { type: "boolean" }
      ? ComponentType<Omit<typeof TraitCheckbox, "trait">>
      : never
}

export type TraitsFormProps<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
> = {
  traitFields: TraitsComponents<TTraitsConfig> & {
    Submit: ComponentType<{ children: ReactNode }>
  }
  oidcProviders: OidcProviderComponents<TOidcProvidersConfig>
  errors: Array<AuthError>
  isSubmitting: boolean
  isValidating: boolean
}

type TraitsFormWrapperProps<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
> = {
  traitsConfig: TTraitsConfig
  oidcProvidersConfig?: TOidcProvidersConfig
  traitsForm: ComponentType<TraitsFormProps<TTraitsConfig, TOidcProvidersConfig>>
  onError?: OnRegistrationFlowError<TTraitsConfig>
  onRegistrationSuccess?: () => void
}

export function TraitsFormWrapper<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
>({
  traitsConfig,
  oidcProvidersConfig,
  traitsForm: TraitsForm,
  onError,
  onRegistrationSuccess,
}: TraitsFormWrapperProps<TTraitsConfig, TOidcProvidersConfig>) {
  const traitsForm = useTraitsForm({ traitsConfig, onError, onRegistrationSuccess })
  const formErrors = useFormErrors(traitsForm)
  const { data: registrationFlow } = useGetRegistrationFlow()

  const traitComponents = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(traitsConfig).map(([key, value]) => [
          key,
          value.type === "boolean"
            ? ({ children }: { children: ReactNode }) => <TraitCheckbox children={children} trait={value.trait} />
            : ({ children }: { children: ReactNode }) => <TraitInput children={children} trait={value.trait} />,
        ]),
      ) as TraitsComponents<TTraitsConfig>,
    [traitsConfig],
  )

  const oidcProviderComponents = useMemo<OidcProviderComponents<TOidcProvidersConfig>>(() => {
    if (!registrationFlow) return {}

    const availableProviders = getAllOidcProviderUiNodes(registrationFlow.ui.nodes)
    const configuredProviderIds = new Set(oidcProvidersConfig?.map(p => p.id) ?? [])
    const components: Record<string, ComponentType<{ children: ReactNode }>> = {}

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      
      // Only include providers that are both available in the flow and configured (or all if no config)
      if (configuredProviderIds.size === 0 || configuredProviderIds.has(providerId)) {
        const providerName = toUpperFirst(providerId)
        
        components[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId}>{children}</Oidc>
        )
      }
    })

    return components as OidcProviderComponents<TOidcProvidersConfig>
  }, [registrationFlow, oidcProvidersConfig])

  return (
    <TraitsFormProvider traitsForm={traitsForm}>
      <form
        onSubmit={e => {
          e.preventDefault()
          traitsForm.handleSubmit()
        }}>
        <TraitsForm
          errors={formErrors}
          isSubmitting={traitsForm.state.isSubmitting}
          isValidating={traitsForm.state.isValidating}
          oidcProviders={oidcProviderComponents}
          traitFields={{
            ...traitComponents,
            Submit,
          }}
        />
      </form>
    </TraitsFormProvider>
  )
}
