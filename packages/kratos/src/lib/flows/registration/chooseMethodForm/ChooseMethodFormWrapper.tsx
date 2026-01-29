import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, OidcProviderComponents, OidcProvidersConfig, TraitsConfig } from "../../../utils"
import { Submit } from "../../fields"
import { OnRegistrationFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Passkey, Password, PasswordConfirmation, ReturnToTraitsForm } from "./fields"
import { useChooseMethodForm } from "./useChooseMethodForm"

export type ChooseMethodFormProps = {
  ReturnToTraitsForm: ComponentType<{ children: ReactNode }>
  Passkey: ComponentType<{ children: ReactNode }>
  passwordFields: {
    Password: ComponentType<{ children: ReactNode }>
    PasswordConfirmation: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
  }
  errors: Array<AuthError>
  isSubmitting: boolean
  isValidating: boolean
}

type ChooseMethodFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
  chooseMethodForm: ComponentType<ChooseMethodFormProps>
  onError?: OnRegistrationFlowError<TTraitsConfig>
  onRegistrationSuccess?: () => void
}

export function ChooseMethodFormWrapper<TTraitsConfig extends TraitsConfig>({
  chooseMethodForm: ChooseMethodForm,
  onError,
  onRegistrationSuccess,
}: ChooseMethodFormWrapperProps<TTraitsConfig>) {
  const chooseMethodForm = useChooseMethodForm({ onError, onRegistrationSuccess })
  const formErrors = useFormErrors(chooseMethodForm)

  return (
    <ChooseMethodFormProvider chooseMethodForm={chooseMethodForm}>
      <form
        onSubmit={e => {
          e.preventDefault()
          chooseMethodForm.handleSubmit()
        }}>
        <ChooseMethodForm
          errors={formErrors}
          isSubmitting={chooseMethodForm.state.isSubmitting}
          isValidating={chooseMethodForm.state.isValidating}
          Passkey={Passkey}
          passwordFields={{
            Password,
            PasswordConfirmation,
            Submit,
          }}
          ReturnToTraitsForm={ReturnToTraitsForm}
        />
      </form>
    </ChooseMethodFormProvider>
  )
}
