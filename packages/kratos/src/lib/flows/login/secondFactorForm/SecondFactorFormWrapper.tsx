import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { OnLoginFlowError } from "../types"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormProps = {
    Totp?: ComponentType<{ children: ReactNode }>
    Email?: ComponentType<{ children: ReactNode }>
    errors?: AuthError[]
}

type SecondFactorFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorFormProps>
    onError?: OnLoginFlowError
}

export function SecondFactorFormWrapper({ secondFactorForm: SecondFactorForm, onError }: SecondFactorFormWrapperProps) {
    const totpForm = useTotpForm({ onError })
    const formErrors = useFormErrors(totpForm)

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm Email={Email} errors={formErrors} Totp={Totp} />
            </form>
        </SecondFactorFormProvider>
    )
}
