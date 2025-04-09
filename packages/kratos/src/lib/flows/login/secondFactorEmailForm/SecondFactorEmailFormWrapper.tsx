import { ComponentType, ReactNode, useMemo } from "react"
import { Code, Resend } from "./fields"
import { secondFactorEmailFormContext, SecondFactorEmailFormContextData } from "./secondFactorEmailFormContext"
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

    const secondFactorEmailFormContextData = useMemo<SecondFactorEmailFormContextData>(() => ({ codeForm }), [codeForm])

    return (
        <secondFactorEmailFormContext.Provider value={secondFactorEmailFormContextData}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    codeForm.handleSubmit()
                }}>
                <SecondFactorForm Code={Code} Resend={Resend} />
            </form>
        </secondFactorEmailFormContext.Provider>
    )
}
