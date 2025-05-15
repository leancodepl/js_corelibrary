import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { OnLoginFlowError } from "../types"
import { Code, Resend } from "./fields"
import { SecondFactorEmailFormProvider } from "./secondFactorEmailFormContext"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormProps = {
    Code: ComponentType<{ children: ReactNode }>
    Resend: ComponentType<{ children: ReactNode }>
    errors?: AuthError[]
}

type SecondFactorEmailFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorEmailFormProps>
    onError?: OnLoginFlowError
}

export function SecondFactorEmailFormWrapper({
    secondFactorForm: SecondFactorForm,
    onError,
}: SecondFactorEmailFormWrapperProps) {
    const codeForm = useCodeForm({ onError })
    const formErrors = useFormErrors(codeForm)

    return (
        <SecondFactorEmailFormProvider codeForm={codeForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <SecondFactorForm Code={Code} errors={formErrors} Resend={Resend} />
            </form>
        </SecondFactorEmailFormProvider>
    )
}
