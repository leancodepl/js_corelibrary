import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnRecoveryFlowError } from "../types"
import { CodeFormProvider } from "./codeFormContext"
import { Code } from "./fields"
import { useCodeForm } from "./useCodeForm"

export type CodeFormProps = {
    Code?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
}

type CodeFormWrapperProps = {
    codeForm: ComponentType<CodeFormProps>
    onError?: OnRecoveryFlowError
}

export function CodeFormWrapper({ codeForm: CodeForm, onError }: CodeFormWrapperProps) {
    const codeForm = useCodeForm({ onError })
    const formErrors = useFormErrors(codeForm)

    return (
        <CodeFormProvider codeForm={codeForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <CodeForm
                    Code={Code}
                    errors={formErrors}
                    isSubmitting={codeForm.state.isSubmitting}
                    isValidating={codeForm.state.isValidating}
                />
            </form>
        </CodeFormProvider>
    )
}
