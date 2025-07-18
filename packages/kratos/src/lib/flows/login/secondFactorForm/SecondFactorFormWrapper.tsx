import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnLoginFlowError } from "../types"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

/**
 * Props for the SecondFactorForm component.
 *
 * @property {ComponentType<{ children: ReactNode }>} [Totp] - Optional component for rendering the TOTP (Time-based One-Time Password) input.
 * @property {ComponentType<{ children: ReactNode }>} [Email] - Optional component for rendering the Email button.
 * @property {AuthError[]} errors - Array of authentication errors to display.
 * @property {boolean} isRefresh - Indicates if the flow is for refresh credentials.
 * @property {boolean} isSubmitting - Indicates if the form is currently submitting.
 * @property {boolean} isValidating - Indicates if the form is currently validating.
 */
export type SecondFactorFormProps = {
    Totp?: ComponentType<{ children: ReactNode }>
    Email?: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
    isRefresh: boolean | undefined
    isSubmitting: boolean
    isValidating: boolean
}

type SecondFactorFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorFormProps>
    isRefresh: boolean | undefined
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function SecondFactorFormWrapper({
    secondFactorForm: SecondFactorForm,
    isRefresh,
    onError,
    onLoginSuccess,
}: SecondFactorFormWrapperProps) {
    const totpForm = useTotpForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(totpForm)

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm
                    Email={Email}
                    errors={formErrors}
                    isRefresh={isRefresh}
                    isSubmitting={totpForm.state.isSubmitting}
                    isValidating={totpForm.state.isValidating}
                    Totp={Totp}
                />
            </form>
        </SecondFactorFormProvider>
    )
}
