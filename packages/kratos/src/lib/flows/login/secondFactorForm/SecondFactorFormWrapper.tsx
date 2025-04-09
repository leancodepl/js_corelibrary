import { ComponentType, ReactNode, useMemo } from "react"
import { Email, Totp } from "./fields"
import { secondFactorFormContext, SecondFactorFormContextData } from "./secondFactorFormContext"
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

    const secondFactorFormContextData = useMemo<SecondFactorFormContextData>(() => ({ totpForm }), [totpForm])

    return (
        <secondFactorFormContext.Provider value={secondFactorFormContextData}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                <SecondFactorForm Email={Email} Totp={Totp} />
            </form>
        </secondFactorFormContext.Provider>
    )
}
