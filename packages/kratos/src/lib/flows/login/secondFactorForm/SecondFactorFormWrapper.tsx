import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormProps = {
    Totp?: ComponentType<{ children: ReactNode }>
    Email?: ComponentType<{ children: ReactNode }>
    formErrors?: Array<AuthError>
}

type SecondFactorFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorFormProps>
}

export function SecondFactorFormWrapper({ secondFactorForm: SecondFactorForm }: SecondFactorFormWrapperProps) {
    const totpForm = useTotpForm()
    const formErrors = useFormErrors(totpForm)

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm Email={Email} formErrors={formErrors} Totp={Totp} />
            </form>
        </SecondFactorFormProvider>
    )
}
