import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { Submit } from "../../fields"
import { OnRecoveryFlowError } from "../types"
import { EmailFormProvider } from "./emailFormContext"
import { Email } from "./fields"
import { useEmailForm } from "./useEmailForm"

export type EmailFormProps = {
    Email: ComponentType<{ children: ReactNode }>
    Submit: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
}

type EmailFormWrapperProps = {
    emailForm: ComponentType<EmailFormProps>
    onError?: OnRecoveryFlowError
}

export function EmailFormWrapper({ emailForm: EmailForm, onError }: EmailFormWrapperProps) {
    const emailForm = useEmailForm({ onError })
    const formErrors = useFormErrors(emailForm)

    return (
        <EmailFormProvider emailForm={emailForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    emailForm.handleSubmit()
                }}>
                <EmailForm
                    Email={Email}
                    errors={formErrors}
                    isSubmitting={emailForm.state.isSubmitting}
                    isValidating={emailForm.state.isValidating}
                    Submit={Submit}
                />
            </form>
        </EmailFormProvider>
    )
}
