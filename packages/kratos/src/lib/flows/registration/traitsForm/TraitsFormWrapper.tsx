import { ComponentType, ReactNode, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { useFormErrors, useOidcProviders } from "../../../hooks"
import { AuthError, getAllOidcProviderUiNodes, TraitsConfig } from "../../../utils"
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

type OidcProviderComponents = {
  [key: string]: ComponentType<{ children: ReactNode }> | undefined
}

export type TraitsFormProps<TTraitsConfig extends TraitsConfig> = {
  traitFields: TraitsComponents<TTraitsConfig> & {
    Submit: ComponentType<{ children: ReactNode }>
  }
  oidcProviders: OidcProviderComponents
  errors: Array<AuthError>
  isSubmitting: boolean
  isValidating: boolean
}

type TraitsFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
  traitsConfig: TTraitsConfig
  traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
  onError?: OnRegistrationFlowError<TTraitsConfig>
  onRegistrationSuccess?: () => void
}

export function TraitsFormWrapper<TTraitsConfig extends TraitsConfig>({
  traitsConfig,
  traitsForm: TraitsForm,
  onError,
  onRegistrationSuccess,
}: TraitsFormWrapperProps<TTraitsConfig>) {
  const traitsForm = useTraitsForm({ traitsConfig, onError, onRegistrationSuccess })
  const formErrors = useFormErrors(traitsForm)
  const { data: registrationFlow } = useGetRegistrationFlow()
  const customOidcProviders = useOidcProviders()

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

  const oidcProviderComponents = useMemo(() => {
    if (!registrationFlow) return {}

    const availableProviders = getAllOidcProviderUiNodes(registrationFlow.ui.nodes)
    const components: OidcProviderComponents = {}

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      const providerName = toUpperFirst(providerId)
      
      components[providerName] = ({ children }: { children: ReactNode }) => (
        <Oidc provider={providerId}>{children}</Oidc>
      )
    })

    return components
  }, [registrationFlow])

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
