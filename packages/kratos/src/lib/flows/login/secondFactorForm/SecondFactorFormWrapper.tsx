import { ComponentType, ReactNode } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
import { OnLoginFlowError } from "../types"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormProps = {
    Totp?: ComponentType<{ children: ReactNode }>
    Email?: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
    isSubmitting: boolean
    isValidating: boolean
}

type SecondFactorFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorFormProps>
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function SecondFactorFormWrapper({
    secondFactorForm: SecondFactorForm,
    onError,
    onLoginSuccess,
}: SecondFactorFormWrapperProps) {
    const totpForm = useTotpForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(totpForm)

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm
                    Email={Email}
                    errors={formErrors}
                    isSubmitting={totpForm.state.isSubmitting}
                    isValidating={totpForm.state.isValidating}
                    Totp={Totp}
                />
            </form>
        </SecondFactorFormProvider>
    )
}
