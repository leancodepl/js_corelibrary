import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnRegistrationFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Passkey, Password, PasswordConfirmation, ReturnToTraitsForm } from "./fields"
import { useChooseMethodForm } from "./useChooseMethodForm"

export type ChooseMethodFormProps = {
    ReturnToTraitsForm?: ComponentType<{ children: ReactNode }>
    Password?: ComponentType<{ children: ReactNode }>
    PasswordConfirmation?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
}

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    onError?: OnRegistrationFlowError
    onRegistrationSuccess?: () => void
}

export function ChooseMethodFormWrapper({
    chooseMethodForm: ChooseMethodForm,
    onError,
    onRegistrationSuccess,
}: ChooseMethodFormWrapperProps) {
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
                    Password={Password}
                    PasswordConfirmation={PasswordConfirmation}
                    ReturnToTraitsForm={ReturnToTraitsForm}
                />
            </form>
        </ChooseMethodFormProvider>
    )
}
