import { ComponentType, ReactNode, useMemo } from "react"
import { useFormErrors } from "../../../hooks"
import { UiNodeImageAttributesNodeTypeEnum } from "../../../kratos"
import { AuthError, getNodeById, TraitsConfig } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { Code, Unlink } from "./fields"
import { TotpFormProvider } from "./totpFormContext"
import { useTotpForm } from "./useTotpForm"

type TotpFormPropsBase = {
    emailVerificationRequired?: boolean
}

type TotpFormPropsLoading = TotpFormPropsBase & {
    isLoading: true
}

type TotpFormPropsLoaded = TotpFormPropsBase & {
    isLoading?: false
}

type TotpFormPropsLinked = TotpFormPropsLoaded & {
    isTotpLinked: true
    Unlink?: ComponentType<{ children: ReactNode }>
}

type TotpFormPropsUnlinked = TotpFormPropsLoaded & {
    isTotpLinked?: false
    Code?: ComponentType<{ children: ReactNode }>
    totpQrImageSrc?: string
    totpSecretKey?: string
    errors: Array<AuthError>
    isSubmitting: boolean
    isValidating: boolean
}

export type TotpFormProps = TotpFormPropsLinked | TotpFormPropsLoading | TotpFormPropsUnlinked

type TotpFormWrapperProps<TTraitsConfig extends TraitsConfig> = {
    totpForm: ComponentType<TotpFormProps>
    emailVerificationRequired?: boolean
    onError?: OnSettingsFlowError<TTraitsConfig>
    onTotpSuccess?: () => void
}

export function TotpFormWrapper<TTraitsConfig extends TraitsConfig>({
    totpForm: TotpForm,
    emailVerificationRequired,
    onError,
    onTotpSuccess,
}: TotpFormWrapperProps<TTraitsConfig>) {
    const totpForm = useTotpForm({ onError, onTotpSuccess })
    const formErrors = useFormErrors(totpForm)

    const { data: settingsFlow } = useGetSettingsFlow()

    const totpQrImageSrc = useMemo(() => {
        if (!settingsFlow) return undefined

        const node = getNodeById(settingsFlow.ui.nodes, "totp_qr")

        if (!node || node.attributes.node_type !== UiNodeImageAttributesNodeTypeEnum.Img) {
            return undefined
        }

        return node.attributes.src
    }, [settingsFlow])

    const totpSecretKey = useMemo(() => {
        if (!settingsFlow) return undefined

        const node = getNodeById(settingsFlow.ui.nodes, "totp_secret_key")

        if (!node || node.attributes.node_type !== UiNodeImageAttributesNodeTypeEnum.Text) {
            return undefined
        }

        const { text } = node.attributes

        if (text.context && "secret" in text.context && typeof text.context.secret === "string") {
            return text.context.secret
        }

        return text.text
    }, [settingsFlow])

    const isTotpLinked = useMemo(() => {
        if (!settingsFlow) return undefined

        return !!getNodeById(settingsFlow.ui.nodes, "totp_unlink")
    }, [settingsFlow])

    const isLoading = !settingsFlow || isTotpLinked === undefined

    return (
        <TotpFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                {isLoading ? (
                    <TotpForm isLoading />
                ) : isTotpLinked ? (
                    <TotpForm isTotpLinked emailVerificationRequired={emailVerificationRequired} Unlink={Unlink} />
                ) : (
                    <TotpForm
                        Code={Code}
                        emailVerificationRequired={emailVerificationRequired}
                        errors={formErrors}
                        isSubmitting={totpForm.state.isSubmitting}
                        isValidating={totpForm.state.isValidating}
                        totpQrImageSrc={totpQrImageSrc}
                        totpSecretKey={totpSecretKey}
                    />
                )}
            </form>
        </TotpFormProvider>
    )
}
