import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { Code, Resend } from "./fields"
import { SecondFactorEmailFormProvider } from "./secondFactorEmailFormContext"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormProps = {
    Code: ComponentType<{ children: ReactNode }>
    Resend: ComponentType<{ children: ReactNode }>
    formErrors?: Array<AuthError>
}

type SecondFactorEmailFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorEmailFormProps>
}

export function SecondFactorEmailFormWrapper({
    secondFactorForm: SecondFactorForm,
}: SecondFactorEmailFormWrapperProps) {
    const codeForm = useCodeForm()
    const formErrors = useFormErrors(codeForm)

    return (
        <SecondFactorEmailFormProvider codeForm={codeForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <SecondFactorForm Code={Code} formErrors={formErrors} Resend={Resend} />
            </form>
        </SecondFactorEmailFormProvider>
    )
}
