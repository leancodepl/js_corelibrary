import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, TraitsConfig } from "../../../utils"
import { Submit } from "../../fields"
import { useGetSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { Password, PasswordConfirmation } from "./fields"
import { NewPasswordFormProvider } from "./newPasswordFormContext"
import { useNewPasswordForm } from "./useNewPasswordForm"

export type NewPasswordFormProps = {
    Password: ComponentType<{ children: ReactNode }>
    PasswordConfirmation: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
    isLoading: boolean
    isSubmitting: boolean
    isValidating: boolean
    emailVerificationRequired?: boolean
}

type NewPasswordFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
    newPasswordForm: ComponentType<NewPasswordFormProps>
    emailVerificationRequired?: boolean
    onError?: OnSettingsFlowError<TTraitsConfig>
    onChangePasswordSuccess?: () => void
}

export function NewPasswordFormWrapper<TTraitsConfig extends TraitsConfig>({
    newPasswordForm: NewPasswordForm,
    emailVerificationRequired,
    onError,
    onChangePasswordSuccess,
}: NewPasswordFormWrapperProps<TTraitsConfig>) {
    const { data: settingsFlow } = useGetSettingsFlow()
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
                    emailVerificationRequired={emailVerificationRequired}
                    errors={formErrors}
                    isLoading={!settingsFlow}
                    isSubmitting={newPasswordForm.state.isSubmitting}
                    isValidating={newPasswordForm.state.isValidating}
                    Password={Password}
                    PasswordConfirmation={PasswordConfirmation}
                    Submit={Submit}
                />
            </form>
        </NewPasswordFormProvider>
    )
}
