import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, getNodeById } from "../../../utils"
import { Submit } from "../../fields"
import { useGetLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

/**
 * Props for the SecondFactorForm component.
 *
 * @property {ComponentType<{ children: ReactNode }>} [Email] - Optional component for rendering the Email button for second factor authentication.
 * @property {ComponentType<{ children: ReactNode }>} Totp - Component for rendering the TOTP (Time-based One-Time Password) input field.
 * @property {ComponentType<{ children: ReactNode }>} Submit - Component for rendering the TOTP submit button.
 * @property {AuthError[]} errors - Array of authentication errors to display to the user.
 * @property {boolean | undefined} isRefresh - Indicates if the flow is for refresh credentials.
 * @property {boolean} isSubmitting - Indicates if the form is currently being submitted.
 * @property {boolean} isValidating - Indicates if the form is currently being validated.
 */
export type SecondFactorFormProps = {
    Email?: ComponentType<{ children: ReactNode }>
    Totp: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
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
    const { data: loginFlow } = useGetLoginFlow()

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm
                    Email={getNodeById(loginFlow?.ui.nodes, "address") && Email}
                    errors={formErrors}
                    isRefresh={isRefresh}
                    isSubmitting={totpForm.state.isSubmitting}
                    isValidating={totpForm.state.isValidating}
                    Submit={Submit}
                    Totp={Totp}
                />
            </form>
        </SecondFactorFormProvider>
    )
}
