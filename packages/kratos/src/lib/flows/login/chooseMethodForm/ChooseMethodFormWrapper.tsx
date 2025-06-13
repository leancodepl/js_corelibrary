import { ComponentProps, ComponentType, ReactNode, useCallback, useMemo } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, getNodeById } from "../../../utils"
import { useGetLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Apple, Facebook, Google, Identifier, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

export type ChooseMethodFormProps = {
    identifier?: string
    Identifier?: ComponentType<{ children: ReactNode }>
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
    isLoading: boolean
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
    const { data: loginFlow } = useGetLoginFlow()
    const passwordForm = usePasswordForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(passwordForm)

    const PasskeyWithFormErrorHandler = useCallback(
        (props: Omit<ComponentProps<typeof Passkey>, "onError">) => <Passkey {...props} onError={onError} />,
        [onError],
    )

    const existingIdentifierFromFlow = useMemo(() => {
        if (!loginFlow) return undefined

        const node = getNodeById(loginFlow.ui.nodes, "identifier")

        if (!node || node.attributes.node_type !== "input" || typeof node.attributes.value !== "string") {
            return undefined
        }

        return node.attributes.value
    }, [loginFlow])

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
                    Identifier={!existingIdentifierFromFlow ? Identifier : undefined}
                    identifier={existingIdentifierFromFlow}
                    isLoading={!loginFlow}
                    isSubmitting={passwordForm.state.isSubmitting}
                    isValidating={passwordForm.state.isValidating}
                    Passkey={PasskeyWithFormErrorHandler}
                    Password={Password}
                />
            </form>
        </ChooseMethodFormProvider>
    )
}
