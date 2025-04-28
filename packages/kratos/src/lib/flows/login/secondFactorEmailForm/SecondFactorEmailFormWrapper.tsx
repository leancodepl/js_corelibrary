import { ComponentType, ReactNode } from "react"
import { Code, Resend } from "./fields"
import { SecondFactorEmailFormProvider } from "./secondFactorEmailFormContext"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormProps = {
    Code: ComponentType<{ children: ReactNode }>
    Resend: ComponentType<{ children: ReactNode }>
}

type SecondFactorEmailFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorEmailFormProps>
}

export function SecondFactorEmailFormWrapper({
    secondFactorForm: SecondFactorForm,
}: SecondFactorEmailFormWrapperProps) {
    const codeForm = useCodeForm()

    return (
        <SecondFactorEmailFormProvider codeForm={codeForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <SecondFactorForm Code={Code} Resend={Resend} />
            </form>
        </SecondFactorEmailFormProvider>
    )
}
