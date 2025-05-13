import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { OnRegistrationFlowError } from "../types"
import { EmailVerificationFormProvider } from "./emailVerificationFormContext"
import { Code, Resend } from "./fields"
import { useEmailVerificationForm } from "./useEmailVerificationForm"

export type EmailVerificationFormProps = {
    Code: ComponentType<{ children: ReactNode }>
    Resend: ComponentType<{ children: ReactNode }>
    errors?: Array<AuthError>
}

type EmailVerificationFormWrapperProps = {
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    onError?: OnRegistrationFlowError
    onVerificationSuccess?: () => void
}

export function EmailVerificationFormWrapper({
    emailVerificationForm: EmailVerificationForm,
    onError,
    onVerificationSuccess,
}: EmailVerificationFormWrapperProps) {
    const emailVerificationForm = useEmailVerificationForm({ onError, onVerificationSuccess })
    const formErrors = useFormErrors(emailVerificationForm)

    return (
        <EmailVerificationFormProvider emailVerificationForm={emailVerificationForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    emailVerificationForm.handleSubmit()
                }}>
                <EmailVerificationForm Code={Code} errors={formErrors} Resend={Resend} />
            </form>
        </EmailVerificationFormProvider>
    )
}
