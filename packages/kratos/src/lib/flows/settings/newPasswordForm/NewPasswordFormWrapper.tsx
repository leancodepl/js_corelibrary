import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnSettingsFlowError } from "../types"
import { Password, PasswordConfirmation } from "./fields"
import { NewPasswordFormProvider } from "./newPasswordFormContext"
import { useNewPasswordForm } from "./useNewPasswordForm"

export type NewPasswordFormProps = {
    Password?: ComponentType<{ children: ReactNode }>
    PasswordConfirmation?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
}

type NewPasswordFormWrapperProps = {
    newPasswordForm: ComponentType<NewPasswordFormProps>
    onError?: OnSettingsFlowError
    onChangePasswordSuccess?: () => void
}

export function NewPasswordFormWrapper({
    newPasswordForm: NewPasswordForm,
    onError,
    onChangePasswordSuccess,
}: NewPasswordFormWrapperProps) {
    const newPasswordForm = useNewPasswordForm({ onError, onChangePasswordSuccess })
    const formErrors = useFormErrors(newPasswordForm)

    return (
        <NewPasswordFormProvider newPasswordForm={newPasswordForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    newPasswordForm.handleSubmit()
                }}>
                <NewPasswordForm
                    errors={formErrors}
                    isSubmitting={newPasswordForm.state.isSubmitting}
                    isValidating={newPasswordForm.state.isValidating}
                    Password={Password}
                    PasswordConfirmation={PasswordConfirmation}
                />
            </form>
        </NewPasswordFormProvider>
    )
}
