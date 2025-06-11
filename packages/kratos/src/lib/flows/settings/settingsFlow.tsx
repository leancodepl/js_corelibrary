import { ComponentType, ReactNode, useEffect } from "react"
import { SettingsFlowProvider, useCreateSettingsFlow, useSettingsFlowContext } from "./hooks"
import { NewPasswordFormProps, NewPasswordFormWrapper } from "./newPasswordForm"
import { OnSettingsFlowError } from "./types"

export type SettingsFlowProps = {
    newPasswordForm: ComponentType<NewPasswordFormProps>
    initialFlowId?: string
    initialVerifiableAddress?: string
    returnTo?: string
    onError?: OnSettingsFlowError
    onChangePasswordSuccess?: () => void
    settingsForm: ComponentType<{
        newPasswordFormWrapper: ReactNode
    }>
}

export function SettingsFlow(props: SettingsFlowProps) {
    return (
        <SettingsFlowProvider>
            <SettingsFlowWrapper {...props} />
        </SettingsFlowProvider>
    )
}

export function SettingsFlowWrapper({
    newPasswordForm: NewPasswordForm,
    settingsForm: SettingsForm,
    initialFlowId,
    returnTo,
    onError,
    onChangePasswordSuccess,
}: SettingsFlowProps) {
    const { settingsFlowId, setSettingsFlowId } = useSettingsFlowContext()

    const { mutate: createSettingsFlow } = useCreateSettingsFlow({ returnTo })

    useEffect(() => {
        if (settingsFlowId) return

        if (initialFlowId) {
            setSettingsFlowId(initialFlowId)
        } else {
            createSettingsFlow()
        }
    }, [createSettingsFlow, initialFlowId, settingsFlowId, setSettingsFlowId])

    return (
        <SettingsForm
            newPasswordFormWrapper={
                <NewPasswordFormWrapper
                    newPasswordForm={NewPasswordForm}
                    onChangePasswordSuccess={onChangePasswordSuccess}
                    onError={onError}
                />
            }
        />
    )
}
