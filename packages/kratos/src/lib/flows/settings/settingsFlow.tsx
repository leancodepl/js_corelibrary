import { ComponentType, ReactNode } from "react"
import { useFlowManager } from "../../hooks/useFlowManager"
import { TraitsConfig } from "../../utils"
import { SettingsFlowProvider, useCreateSettingsFlow, useGetSettingsFlow, useSettingsFlowContext } from "./hooks"
import { NewPasswordFormProps, NewPasswordFormWrapper } from "./newPasswordForm"
import { OidcFormProps, OidcFormWrapper } from "./oidcForm"
import { PasskeysFormProps, PasskeysFormWrapper } from "./passkeysForm"
import { TotpFormProps, TotpFormWrapper } from "./totpForm"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnSettingsFlowError } from "./types"

export type SettingsFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig?: TTraitsConfig
    traitsForm?: ComponentType<TraitsFormProps<TTraitsConfig>>
    newPasswordForm?: ComponentType<NewPasswordFormProps>
    passkeysForm?: ComponentType<PasskeysFormProps>
    totpForm?: ComponentType<TotpFormProps>
    oidcForm?: ComponentType<OidcFormProps>
    initialFlowId?: string
    initialVerifiableAddress?: string
    onError?: OnSettingsFlowError<TTraitsConfig>
    onChangePasswordSuccess?: () => void
    onChangeTraitsSuccess?: () => void
    onFlowRestart?: () => void
    settingsForm: ComponentType<{
        isLoading?: boolean
        emailVerificationRequired: boolean
        newPasswordForm: ReactNode
        traitsForm?: ReactNode
        passkeysForm?: ReactNode
        totpForm?: ReactNode
        oidcForm?: ReactNode
    }>
}

/**
 * Renders a complete settings flow with user account management capabilities.
 *
 * @template TTraitsConfig - Configuration type for user traits that extends TraitsConfig
 * @param props - Settings flow configuration and form components
 * @param props.traitsConfig - Configuration for user traits fields
 * @param props.traitsForm - Component for editing user traits/profile information
 * @param props.newPasswordForm - Component for changing user password
 * @param props.passkeysForm - Component for managing passkey authentication
 * @param props.totpForm - Component for TOTP/2FA configuration
 * @param props.oidcForm - Component for OAuth/OIDC provider management
 * @param props.initialFlowId - Existing flow ID to resume
 * @param props.initialVerifiableAddress - Email address requiring verification
 * @param props.onError - Callback for handling flow errors
 * @param props.onChangePasswordSuccess - Callback after successful password change
 * @param props.onChangeTraitsSuccess - Callback after successful traits update
 * @param props.onFlowRestart - Callback when flow restarts
 * @param props.settingsForm - Main settings form component that renders all sections
 * @returns React component for the settings flow
 * @example
 * ```typescript
 * import { SettingsFlow } from '@leancodepl/kratos';
 *
 * const traitsConfig = { Email: { trait: "email", type: "string", }, GivenName: { trait: "given_name", type: "string", } } as const;
 *
 * function UserSettings() {
 *   return (
 *     <SettingsFlow
 *       traitsConfig={traitsConfig}
 *       traitsForm={MyTraitsForm}
 *       newPasswordForm={MyPasswordForm}
 *       settingsForm={MyMainSettings}
 *       onChangePasswordSuccess={() => console.log('Password updated')}
 *       onError={(error) => console.error('Settings error:', error)}
 *     />
 *   );
 * }
 * ```
 */
export function SettingsFlow<TTraitsConfig extends TraitsConfig>(props: SettingsFlowProps<TTraitsConfig>) {
    return (
        <SettingsFlowProvider>
            <SettingsFlowWrapper {...props} />
        </SettingsFlowProvider>
    )
}

export function SettingsFlowWrapper<TTraitsConfig extends TraitsConfig>({
    newPasswordForm: NewPasswordForm,
    traitsForm: TraitsForm,
    passkeysForm: PasskeysForm,
    totpForm: TotpForm,
    oidcForm: OidcForm,
    traitsConfig,
    settingsForm: SettingsForm,
    initialFlowId,
    onError,
    onChangePasswordSuccess,
    onChangeTraitsSuccess,
    onFlowRestart,
}: SettingsFlowProps<TTraitsConfig>) {
    const { settingsFlowId, setSettingsFlowId, emailVerificationRequired } = useSettingsFlowContext()

    const { mutate: createSettingsFlow } = useCreateSettingsFlow()
    const { data: settingsFlow, error } = useGetSettingsFlow()

    useFlowManager({
        initialFlowId,
        currentFlowId: settingsFlowId,
        error,
        onFlowRestart,
        createFlow: createSettingsFlow,
        setFlowId: setSettingsFlowId,
    })

    return (
        <SettingsForm
            emailVerificationRequired={emailVerificationRequired}
            isLoading={!settingsFlow}
            newPasswordForm={
                NewPasswordForm && (
                    <NewPasswordFormWrapper
                        emailVerificationRequired={emailVerificationRequired}
                        newPasswordForm={NewPasswordForm}
                        onChangePasswordSuccess={onChangePasswordSuccess}
                        onError={onError}
                    />
                )
            }
            oidcForm={OidcForm && <OidcFormWrapper oidcForm={OidcForm} />}
            passkeysForm={PasskeysForm && <PasskeysFormWrapper passkeysForm={PasskeysForm} />}
            totpForm={
                TotpForm && (
                    <TotpFormWrapper
                        emailVerificationRequired={emailVerificationRequired}
                        totpForm={TotpForm}
                        onError={onError}
                        onTotpSuccess={onChangeTraitsSuccess}
                    />
                )
            }
            traitsForm={
                traitsConfig &&
                TraitsForm && (
                    <TraitsFormWrapper
                        emailVerificationRequired={emailVerificationRequired}
                        traitsConfig={traitsConfig}
                        traitsForm={TraitsForm}
                        onChangeTraitsSuccess={onChangeTraitsSuccess}
                        onError={onError}
                    />
                )
            }
        />
    )
}
