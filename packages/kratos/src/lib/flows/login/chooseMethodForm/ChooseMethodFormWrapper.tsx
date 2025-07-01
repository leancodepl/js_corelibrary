import { ComponentProps, ComponentType, ReactNode, useCallback } from "react"
import { useFormErrors } from "../../../hooks"
import { AuthError, getNodeById, getOidcProviderUiNode } from "../../../utils"
import { useExistingIdentifierFromFlow, useGetLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { ChooseMethodFormProvider } from "./chooseMethodFormContext"
import { Apple, Facebook, Google, Identifier, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

type ChooseMethodFormPropsLoading = {
    isLoading: true
}

type ChooseMethodFormPropsLoadedBase = {
    isLoading?: false
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    errors: AuthError[]
    isSubmitting: boolean
    isValidating: boolean
}

type ChooseMethodFormPropsLoaded = ChooseMethodFormPropsLoadedBase & {
    isRefresh?: false
    Identifier?: ComponentType<{ children: ReactNode }>
}

type ChooseMethodFormPropsLoadedRefresh = ChooseMethodFormPropsLoadedBase & {
    isRefresh: true
    identifier?: string
}

export type ChooseMethodFormProps =
    | ChooseMethodFormPropsLoaded
    | ChooseMethodFormPropsLoadedRefresh
    | ChooseMethodFormPropsLoading

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    isRefresh: boolean | undefined
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function ChooseMethodFormWrapper({
    chooseMethodForm: ChooseMethodForm,
    isRefresh,
    onError,
    onLoginSuccess,
}: ChooseMethodFormWrapperProps) {
    const { data: loginFlow } = useGetLoginFlow()
    const passwordForm = usePasswordForm({ onError, onLoginSuccess })
    const formErrors = useFormErrors(passwordForm)
    const existingIdentifier = useExistingIdentifierFromFlow()

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
                {!loginFlow ? (
                    <ChooseMethodForm isLoading />
                ) : isRefresh ? (
                    <ChooseMethodForm
                        isRefresh
                        Apple={getOidcProviderUiNode(loginFlow.ui.nodes, "apple") ? Apple : undefined}
                        errors={formErrors}
                        Facebook={getOidcProviderUiNode(loginFlow.ui.nodes, "facebook") ? Facebook : undefined}
                        Google={getOidcProviderUiNode(loginFlow.ui.nodes, "google") ? Google : undefined}
                        identifier={existingIdentifier}
                        isSubmitting={passwordForm.state.isSubmitting}
                        isValidating={passwordForm.state.isValidating}
                        Passkey={getNodeById(loginFlow?.ui.nodes, "passkey_login") && PasskeyWithFormErrorHandler}
                        Password={Password}
                    />
                ) : (
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
                )}
            </form>
        </ChooseMethodFormProvider>
    )
}
