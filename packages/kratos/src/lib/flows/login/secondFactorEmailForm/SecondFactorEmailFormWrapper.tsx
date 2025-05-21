import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnLoginFlowError } from "../types"
import { Code, Resend } from "./fields"
import { SecondFactorEmailFormProvider } from "./secondFactorEmailFormContext"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormProps = {
    Code: ComponentType<{ children: ReactNode }>
    Resend: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
    isSubmitting: boolean
    isValidating: boolean
}

type SecondFactorEmailFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorEmailFormProps>
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function SecondFactorEmailFormWrapper({
    secondFactorForm: SecondFactorForm,
    onError,
    onLoginSuccess,
}: SecondFactorEmailFormWrapperProps) {
    const codeForm = useCodeForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(codeForm)

    return (
        <SecondFactorEmailFormProvider codeForm={codeForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <SecondFactorForm
                    Code={Code}
                    errors={formErrors}
                    isSubmitting={codeForm.state.isSubmitting}
                    isValidating={codeForm.state.isValidating}
                    Resend={Resend}
                />
            </form>
        </SecondFactorEmailFormProvider>
    )
}
