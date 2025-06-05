import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
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
    emailVerificationRequired?: boolean
}

type NewPasswordFormWrapperProps = {
    newPasswordForm: ComponentType<NewPasswordFormProps>
    emailVerificationRequired?: boolean
    onError?: OnSettingsFlowError
    onChangePasswordSuccess?: () => void
}

export function NewPasswordFormWrapper({
    newPasswordForm: NewPasswordForm,
    emailVerificationRequired,
    onError,
    onChangePasswordSuccess,
}: NewPasswordFormWrapperProps) {
    const { data: settingsFlow } = useGetSettingsFlow()
    const newPasswordForm = useNewPasswordForm({ onError, onChangePasswordSuccess })
    const formErrors = useFormErrors(newPasswordForm)

    if (!settingsFlow) {
        return null
    }

    return (
        <NewPasswordFormProvider newPasswordForm={newPasswordForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    newPasswordForm.handleSubmit()
                }}>
                <NewPasswordForm
                    emailVerificationRequired={emailVerificationRequired}
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
