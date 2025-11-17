import { ComponentType, ReactNode, useMemo } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, TraitsConfig } from "../../../utils"
import { Submit } from "../../fields"
import { OnRegistrationFlowError } from "../types"
import { Apple, Facebook, Google, TraitCheckbox, TraitInput } from "./fields"
import { TraitsFormProvider } from "./traitsFormContext"
import { useTraitsForm } from "./useTraitsForm"

type TraitsComponents<TTraitsConfig extends TraitsConfig> = {
  [K in keyof TTraitsConfig]: TTraitsConfig[K] extends { type: "string" }
    ? ComponentType<Omit<typeof TraitInput, "trait">>
    : TTraitsConfig[K] extends { type: "boolean" }
      ? ComponentType<Omit<typeof TraitCheckbox, "trait">>
      : never
}

export type TraitsFormProps<TTraitsConfig extends TraitsConfig> = {
  traitFields: TraitsComponents<TTraitsConfig> & {
    Submit: ComponentType<{ children: ReactNode }>
  }
  Google: ComponentType<{ children: ReactNode }>
  Apple: ComponentType<{ children: ReactNode }>
  Facebook: ComponentType<{ children: ReactNode }>
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

  return (
    <TraitsFormProvider traitsForm={traitsForm}>
      <form
        onSubmit={e => {
          e.preventDefault()
          traitsForm.handleSubmit()
        }}>
        <TraitsForm
          Apple={Apple}
          errors={formErrors}
          Facebook={Facebook}
          Google={Google}
          isSubmitting={traitsForm.state.isSubmitting}
          isValidating={traitsForm.state.isValidating}
          traitFields={{
            ...traitComponents,
            Submit,
          }}
        />
      </form>
    </TraitsFormProvider>
  )
}
