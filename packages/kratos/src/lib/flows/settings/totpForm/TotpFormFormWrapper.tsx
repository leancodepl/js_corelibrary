import { ComponentType, ReactNode, useMemo } from "react"
import { useFormErrors } from "../../../hooks"
import { UiNodeImageAttributesNodeTypeEnum } from "../../../kratos"
import { AuthError, getNodeById } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { Code, Unlink } from "./fields"
import { TotpFormProvider } from "./totpFormContext"
import { useTotpForm } from "./useTotpForm"

export type TotpFormProps = {
    emailVerificationRequired?: boolean
} & (
    | {
          isTotpLinked: false
          Code?: ComponentType<{ children: ReactNode }>
          totpQrImageSrc?: string
          totpSecretKey?: string
          errors: Array<AuthError>
          isSubmitting: boolean
          isValidating: boolean
      }
    | {
          isTotpLinked: true
          Unlink?: ComponentType<{ children: ReactNode }>
      }
)

type TotpFormWrapperProps = {
    totpForm: ComponentType<TotpFormProps>
    emailVerificationRequired?: boolean
    onError?: OnSettingsFlowError
    onTotpSuccess?: () => void
}

export function TotpFormWrapper({
    totpForm: TotpForm,
    emailVerificationRequired,
    onError,
    onTotpSuccess,
}: TotpFormWrapperProps) {
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

    if (!settingsFlow || isTotpLinked === undefined) {
        return null
    }

    return (
        <TotpFormProvider totpForm={totpForm}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    totpForm.handleSubmit()
                }}>
                {isTotpLinked ? (
                    <TotpForm isTotpLinked emailVerificationRequired={emailVerificationRequired} Unlink={Unlink} />
                ) : (
                    <TotpForm
                        Code={Code}
                        emailVerificationRequired={emailVerificationRequired}
                        errors={formErrors}
                        isSubmitting={totpForm.state.isSubmitting}
                        isTotpLinked={false}
                        isValidating={totpForm.state.isValidating}
                        totpQrImageSrc={totpQrImageSrc}
                        totpSecretKey={totpSecretKey}
                    />
                )}
            </form>
        </TotpFormProvider>
    )
}
