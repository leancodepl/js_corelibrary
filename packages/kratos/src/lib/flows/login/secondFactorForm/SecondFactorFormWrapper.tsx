import { ComponentType, ReactNode } from "react"
import { Email, Totp } from "./fields"
import { SecondFactorFormProvider } from "./secondFactorFormContext"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormProps = {
    Totp?: ComponentType<{ children: ReactNode }>
    Email?: ComponentType<{ children: ReactNode }>
}

type SecondFactorFormWrapperProps = {
    secondFactorForm: ComponentType<SecondFactorFormProps>
}

export function SecondFactorFormWrapper({ secondFactorForm: SecondFactorForm }: SecondFactorFormWrapperProps) {
    const totpForm = useTotpForm()

    return (
        <SecondFactorFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm Email={Email} Totp={Totp} />
            </form>
        </SecondFactorFormProvider>
    )
}
