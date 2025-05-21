import { ComponentProps, ComponentType, ReactNode, useCallback } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError } from "../../../utils"
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
    isSubmitting: boolean
    isValidating: boolean
}

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function ChooseMethodFormWrapper({
    chooseMethodForm: ChooseMethodForm,
    onError,
    onLoginSuccess,
}: ChooseMethodFormWrapperProps) {
    const passwordForm = usePasswordForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(passwordForm)

    const PasskeyWithFormErrorHandler = useCallback(
        (props: Omit<ComponentProps<typeof Passkey>, "onError">) => <Passkey {...props} onError={onError} />,
        [onError],
    )

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
                    isSubmitting={passwordForm.state.isSubmitting}
                    isValidating={passwordForm.state.isValidating}
                    Passkey={PasskeyWithFormErrorHandler}
                    Password={Password}
                />
            </form>
        </ChooseMethodFormProvider>
    )
}
