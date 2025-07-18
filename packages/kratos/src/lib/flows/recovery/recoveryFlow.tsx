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
        error,
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

/**
 * Renders a multi-step password recovery flow with email verification and password reset.
 *
 * Manages the complete recovery process from email submission through code verification
 * to password reset, automatically handling flow state transitions and provider setup.
 *
 * @param props.emailForm - React component for email input step
 * @param props.codeForm - React component for verification code input step
 * @param props.newPasswordForm - React component for new password input step
 * @param props.initialFlowId - Optional existing recovery flow ID to continue
 * @param props.returnTo - Optional URL to redirect after successful recovery
 * @param props.onError - Optional error handler for recovery flow failures
 * @param props.onRecoverySuccess - Optional callback fired when password recovery completes
 * @param props.onFlowRestart - Optional callback fired when flow restarts due to errors
 * @returns JSX element with configured recovery flow providers and step management
 *
 * @example
 * ```tsx
 * import { RecoveryFlow } from "@leancodepl/kratos";
 *
 * function App() {
 *   return (
 *     <RecoveryFlow
 *       emailForm={EmailForm}
 *       codeForm={CodeForm}
 *       newPasswordForm={NewPasswordForm}
 *       onRecoverySuccess={() => console.log("Recovery completed")}
 *       onError={(error) => console.error("Recovery failed:", error)}
 *     />
 *   );
 * }
 * ```
 */
export function RecoveryFlow(props: RecoveryFlowProps) {
    return (
        <SettingsFlowProvider>
            <RecoveryFlowProvider>
                <RecoveryFlowWrapper {...props} />
            </RecoveryFlowProvider>
        </SettingsFlowProvider>
    )
}
