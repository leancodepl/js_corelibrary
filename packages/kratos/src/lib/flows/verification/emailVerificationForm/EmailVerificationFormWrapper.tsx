import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { Submit } from "../../fields"
import { OnVerificationFlowError } from "../types"
import { EmailVerificationFormProvider } from "./emailVerificationFormContext"
import { Code, Resend } from "./fields"
import { useEmailVerificationForm } from "./useEmailVerificationForm"

export type EmailVerificationFormProps = {
  Code: ComponentType<{ children: ReactNode }>
  Submit: ComponentType<{ children: ReactNode }>
  Resend: ComponentType<{ children: ReactNode }>
  errors: Array<AuthError>
  isSubmitting: boolean
  isValidating: boolean
}

type EmailVerificationFormWrapperProps = {
  emailVerificationForm: ComponentType<EmailVerificationFormProps>
  onError?: OnVerificationFlowError
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
        <EmailVerificationForm
          Code={Code}
          errors={formErrors}
          isSubmitting={emailVerificationForm.state.isSubmitting}
          isValidating={emailVerificationForm.state.isValidating}
          Resend={Resend}
          Submit={Submit}
        />
      </form>
    </EmailVerificationFormProvider>
  )
}
