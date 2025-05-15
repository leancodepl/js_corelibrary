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
}

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
}

export function ChooseMethodFormWrapper({
    chooseMethodForm: ChooseMethodForm,
    onError,
    onRegisterationSuccess,
}: ChooseMethodFormWrapperProps) {
    const chooseMethodForm = useChooseMethodForm({ onError, onRegisterationSuccess })
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
                    Passkey={Passkey}
                    Password={Password}
                    PasswordConfirmation={PasswordConfirmation}
                    ReturnToTraitsForm={ReturnToTraitsForm}
                />
            </form>
        </ChooseMethodFormProvider>
    )
}
