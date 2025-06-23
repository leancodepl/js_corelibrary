import { ComponentType, useMemo } from "react"
import { settingsFlow } from ".."
import { useFlowManager } from "../../hooks/useFlowManager"
import { TraitsConfig } from "../../utils"
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

    const { mutate: createRecoveryFlow, isPending: isCreatingRecoveryFlow } = useCreateRecoveryFlow({ returnTo })
    const { data: recoveryFlow } = useGetRecoveryFlow()

    const settingsFlowId = useMemo(
        () => recoveryFlow?.continue_with?.find(action => action.action === "show_settings_ui")?.flow.id,
        [recoveryFlow],
    )

    useFlowManager({
        initialFlowId,
        isCreatingFlow: isCreatingRecoveryFlow,
        currentFlowId: recoveryFlowId,
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
                <settingsFlow.SettingsFlowWrapper
                    initialFlowId={settingsFlowId}
                    newPasswordForm={NewPasswordForm}
                    settingsForm={({ newPasswordForm }) => newPasswordForm}
                    onChangePasswordSuccess={onRecoverySuccess}
                    onError={onError as settingsFlow.OnSettingsFlowError<TTraitsConfig>}
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
