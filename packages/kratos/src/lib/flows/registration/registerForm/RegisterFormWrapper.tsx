import { ComponentType, ReactNode, useMemo } from "react"
import { AuthError, getAuthErrorsFromFormErrorMap } from "../../../utils"
import { OnRegistrationFlowError } from "../types"
import { Apple, Facebook, Google, Password, TraitCheckbox, TraitInput } from "./fields"
import { RegisterFormProvider } from "./registerFormContext"
import { TraitsBase } from "./types"
import { usePasswordForm } from "./usePasswordForm"

export type RegisterFormProps = {
    TraitInput?: ComponentType<{ trait: string; children: ReactNode }>
    TraitCheckbox?: ComponentType<{ trait: string; children: ReactNode }>
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: Array<AuthError>
}

type RegisterFormWrapperProps = {
    traitsDefaultValues: TraitsBase
    registerForm: ComponentType<RegisterFormProps>
    onError?: OnRegistrationFlowError
}

export function RegisterFormWrapper({
    traitsDefaultValues,
    registerForm: RegisterForm,
    onError,
}: RegisterFormWrapperProps) {
    const passwordForm = usePasswordForm({ traitsDefaultValues, onError })
    const formErrors = useMemo(
        () => getAuthErrorsFromFormErrorMap(passwordForm.state.errorMap),
        [passwordForm.state.errorMap],
    )

    return (
        <RegisterFormProvider passwordForm={passwordForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    passwordForm.handleSubmit()
                }}>
                <RegisterForm
                    Apple={Apple}
                    errors={formErrors}
                    Facebook={Facebook}
                    Google={Google}
                    Password={Password}
                    TraitCheckbox={TraitCheckbox}
                    TraitInput={TraitInput}
                />
            </form>
        </RegisterFormProvider>
    )
}
