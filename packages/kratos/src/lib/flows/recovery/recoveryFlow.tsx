import { ComponentType, useMemo } from "react"
import { useFlowManager } from "../../hooks"
import { TraitsConfig } from "../../utils"
import { NewPasswordFormProps, OnSettingsFlowError, SettingsFlowProvider, SettingsFlowWrapper } from "../settings"
import { CodeFormProps, CodeFormWrapper } from "./codeForm"
import { EmailFormProps, EmailFormWrapper } from "./emailForm"
import { RecoveryFlowProvider, useCreateRecoveryFlow, useGetRecoveryFlow, useRecoveryFlowContext } from "./hooks"
import { OnRecoveryFlowError } from "./types"

export type RecoveryFlowProps = {
    emailForm: ComponentType<EmailFormProps>
    codeForm: ComponentType<CodeFormProps>
    newPasswordForm: ComponentType<NewPasswordFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRecoveryFlowError
    onRecoverySuccess?: () => void
    onFlowRestart?: () => void
}

function RecoveryFlowWrapper<TTraitsConfig extends TraitsConfig>({
    emailForm: EmailForm,
    codeForm: CodeForm,
    newPasswordForm: NewPasswordForm,
    initialFlowId,
    returnTo,
    onError,
    onRecoverySuccess,
    onFlowRestart,
}: RecoveryFlowProps) {
    const { recoveryFlowId, setRecoveryFlowId } = useRecoveryFlowContext()

    const { mutate: createRecoveryFlow } = useCreateRecoveryFlow({ returnTo })
    const { data: recoveryFlow, error } = useGetRecoveryFlow()

    const settingsFlowId = useMemo(
        () => recoveryFlow?.continue_with?.find(action => action.action === "show_settings_ui")?.flow.id,
        [recoveryFlow],
    )

    useFlowManager({
        initialFlowId,
        currentFlowId: recoveryFlowId,
        error: error ?? undefined,
        onFlowRestart,
        createFlow: createRecoveryFlow,
        setFlowId: setRecoveryFlowId,
    })

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
                <SettingsFlowWrapper
                    initialFlowId={settingsFlowId}
                    newPasswordForm={NewPasswordForm}
                    settingsForm={({ newPasswordForm }) => newPasswordForm}
                    onChangePasswordSuccess={onRecoverySuccess}
                    onError={onError as OnSettingsFlowError<TTraitsConfig>}
                />
            )}
        </>
    )
}

export function RecoveryFlow(props: RecoveryFlowProps) {
    return (
        <SettingsFlowProvider>
            <RecoveryFlowProvider>
                <RecoveryFlowWrapper {...props} />
            </RecoveryFlowProvider>
        </SettingsFlowProvider>
    )
}
