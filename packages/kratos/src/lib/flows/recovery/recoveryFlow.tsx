import { ComponentType, useEffect, useMemo } from "react"
import { settingsFlow } from ".."
import { CodeFormProps, CodeFormWrapper } from "./codeForm"
import { EmailFormProps, EmailFormWrapper } from "./emailForm"
import { RecoveryFlowProvider, useCreateRecoveryFlow, useGetRecoveryFlow, useRecoveryFlowContext } from "./hooks"
import { OnRecoveryFlowError } from "./types"

export type RecoveryFlowProps = {
    emailForm: ComponentType<EmailFormProps>
    codeForm: ComponentType<CodeFormProps>
    newPasswordForm: ComponentType<settingsFlow.NewPasswordFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRecoveryFlowError
    onRecoverySuccess?: () => void
}

function RecoveryFlowWrapper({
    emailForm: EmailForm,
    codeForm: CodeForm,
    newPasswordForm: NewPasswordForm,
    initialFlowId,
    returnTo,
    onError,
    onRecoverySuccess,
}: RecoveryFlowProps) {
    const { recoveryFlowId, setRecoveryFlowId } = useRecoveryFlowContext()

    const { mutate: createRecoveryFlow } = useCreateRecoveryFlow({ returnTo })
    const { data: recoveryFlow } = useGetRecoveryFlow()

    const settingsFlowId = useMemo(() => {
        if (recoveryFlow !== undefined && "continue_with" in recoveryFlow) {
            const showSettingsUIAction = recoveryFlow.continue_with?.find(
                action => action.action === "show_settings_ui",
            )
            if (showSettingsUIAction) {
                return showSettingsUIAction.flow.id
            }
        }
        return null
    }, [recoveryFlow])

    useEffect(() => {
        if (recoveryFlowId) return

        if (initialFlowId) {
            setRecoveryFlowId(initialFlowId)
        } else {
            createRecoveryFlow()
        }
    }, [recoveryFlowId, initialFlowId, createRecoveryFlow, setRecoveryFlowId])

    const step = useMemo(() => {
        if (settingsFlowId) {
            return "newPassword"
        }
        if (recoveryFlow?.state === "sent_email") {
            return "code"
        }
        return "email"
    }, [recoveryFlow?.state, settingsFlowId])

    return (
        <>
            {step === "email" && <EmailFormWrapper emailForm={EmailForm} onError={onError} />}
            {step === "code" && <CodeFormWrapper codeForm={CodeForm} onError={onError} />}
            {step === "newPassword" && settingsFlowId && (
                <settingsFlow.SettingsFlowWrapper
                    initialFlowId={settingsFlowId}
                    newPasswordForm={NewPasswordForm}
                    settingsForm={({ newPasswordFormWrapper }) => newPasswordFormWrapper}
                    onChangePasswordSuccess={onRecoverySuccess}
                    onError={onError}
                />
            )}
        </>
    )
}

export function RecoveryFlow(props: RecoveryFlowProps) {
    return (
        <settingsFlow.SettingsFlowProvider>
            <RecoveryFlowProvider>
                <RecoveryFlowWrapper {...props} />
            </RecoveryFlowProvider>
        </settingsFlow.SettingsFlowProvider>
    )
}
