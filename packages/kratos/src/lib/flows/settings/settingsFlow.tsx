import { ComponentType, ReactNode, useEffect } from "react"
import { TraitsConfig } from "../registration/types"
import { SettingsFlowProvider, useCreateSettingsFlow, useSettingsFlowContext } from "./hooks"
import { NewPasswordFormProps, NewPasswordFormWrapper } from "./newPasswordForm"
import { PasskeysFormProps, PasskeysFormWrapper } from "./passkeysForm"
import { TotpFormProps, TotpFormWrapper } from "./totpForm"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnSettingsFlowError } from "./types"

export type SettingsFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig?: TTraitsConfig
    traitsForm?: ComponentType<TraitsFormProps<TTraitsConfig>>
    newPasswordForm: ComponentType<NewPasswordFormProps>
    passkeysForm?: ComponentType<PasskeysFormProps>
    totpForm?: ComponentType<TotpFormProps>
    initialFlowId?: string
    initialVerifiableAddress?: string
    onError?: OnSettingsFlowError
    onChangePasswordSuccess?: () => void
    onChangeTraitsSuccess?: () => void
    settingsForm: ComponentType<{
        emailVerificationRequired: boolean
        newPasswordFormWrapper: ReactNode
        traitsFormWrapper?: ReactNode
        passkeysFormWrapper?: ReactNode
        totpFormWrapper?: ReactNode
    }>
}

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
    traitsConfig,
    settingsForm: SettingsForm,
    initialFlowId,
    onError,
    onChangePasswordSuccess,
    onChangeTraitsSuccess,
}: SettingsFlowProps<TTraitsConfig>) {
    const { settingsFlowId, setSettingsFlowId, emailVerificationRequired } = useSettingsFlowContext()

    const { mutate: createSettingsFlow } = useCreateSettingsFlow()

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
            emailVerificationRequired={emailVerificationRequired}
            newPasswordFormWrapper={
                <NewPasswordFormWrapper
                    emailVerificationRequired={emailVerificationRequired}
                    newPasswordForm={NewPasswordForm}
                    onChangePasswordSuccess={onChangePasswordSuccess}
                    onError={onError}
                />
            }
            passkeysFormWrapper={PasskeysForm && <PasskeysFormWrapper passkeysForm={PasskeysForm} />}
            totpFormWrapper={
                TotpForm && (
                    <TotpFormWrapper
                        emailVerificationRequired={emailVerificationRequired}
                        totpForm={TotpForm}
                        onError={onError}
                        onTotpSuccess={onChangeTraitsSuccess}
                    />
                )
            }
            traitsFormWrapper={
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
