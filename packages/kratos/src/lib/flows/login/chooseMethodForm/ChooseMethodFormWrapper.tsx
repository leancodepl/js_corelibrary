import { ComponentType, ReactNode } from "react"
import { AuthError } from "../../../utils"
import { useFormErrors } from "../hooks/useFormErrors"
import { OnLoginFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Apple, Facebook, Google, Identifier, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

export type ChooseMethodFormProps = {
    Identifier?: ComponentType<{ children: ReactNode }>
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
}

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    onError?: OnLoginFlowError
}

export function ChooseMethodFormWrapper({ chooseMethodForm: ChooseMethodForm, onError }: ChooseMethodFormWrapperProps) {
    const passwordForm = usePasswordForm({ onError })
    const formErrors = useFormErrors(passwordForm)

    return (
        <ChooseMethodFormProvider passwordForm={passwordForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    passwordForm.handleSubmit()
                }}>
                <ChooseMethodForm
                    Apple={Apple}
                    errors={formErrors}
                    Facebook={Facebook}
                    Google={Google}
                    Identifier={Identifier}
                    Passkey={Passkey}
                    Password={Password}
                />
            </form>
        </ChooseMethodFormProvider>
    )
}
