import { JSX } from "react"
import { SettingsFlow, UiNodeGroupEnum, UpdateSettingsFlowBody } from "@ory/client"
import { useScriptNodes } from "../helpers/useScriptNodes"
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm"
import { useKratosContext } from "../kratosContext"
import { LookupSecretSettingsSection } from "../sections/lookupSecretSettingsSection"
import { OidcSettingsSection } from "../sections/oidcSettingsSection"
import { PasskeySettingsSection } from "../sections/passkeySettingsSection"
import { PasswordSettingsSection } from "../sections/passwordSettingsSection"
import { ProfileSettingsSection } from "../sections/profileSettingsSection"
import { TotpSettingsSection } from "../sections/totpSettingsSection"
import { hasLookupSecret, hasOidc, hasPasskey, hasPassword, hasTotp } from "../utils/helpers"

export type UserSettingsFlowType =
    | "lookupSecret"
    | "oidc"
    | "password"
    | "profile"
    | "totp"
    | typeof UiNodeGroupEnum.Passkey

export type UserSettingsCardProps = {
    flow: SettingsFlow
    flowType: UserSettingsFlowType
    className?: string
} & UserAuthFormAdditionalProps<UpdateSettingsFlowBody>

export function UserSettingsCard({ flow, flowType, onSubmit, className }: UserSettingsCardProps): JSX.Element | null {
    const {
        components: {
            ProfileSettingsSectionWrapper,
            PasswordSettingsSectionWrapper,
            WebAuthnSettingsSectionWrapper,
            LookupSecretSettingsSectionWrapper,
            OidcSettingsSectionWrapper,
            TotpSettingsSectionWrapper,
            UiMessages,
        },
        excludeScripts,
    } = useKratosContext()

    useScriptNodes({ nodes: flow.ui.nodes, excludeScripts })

    const $flow = (() => {
        if (flowType === "profile") {
            return <ProfileSettingsSection flow={flow} ProfileSettingsSectionWrapper={ProfileSettingsSectionWrapper} />
        } else if (flowType === "password" && hasPassword(flow.ui.nodes)) {
            return (
                <PasswordSettingsSection flow={flow} PasswordSettingsSectionWrapper={PasswordSettingsSectionWrapper} />
            )
        } else if (flowType === UiNodeGroupEnum.Passkey && hasPasskey(flow.ui.nodes)) {
            return <PasskeySettingsSection flow={flow} PasskeySettingsSectionWrapper={WebAuthnSettingsSectionWrapper} />
        } else if (flowType === "lookupSecret" && hasLookupSecret(flow.ui.nodes)) {
            return (
                <LookupSecretSettingsSection
                    flow={flow}
                    LookupSecretSettingsSectionWrapper={LookupSecretSettingsSectionWrapper}
                />
            )
        } else if (flowType === "oidc" && hasOidc(flow.ui.nodes)) {
            return <OidcSettingsSection flow={flow} OidcSettingsSectionWrapper={OidcSettingsSectionWrapper} />
        } else if (flowType === "totp" && hasTotp(flow.ui.nodes)) {
            return <TotpSettingsSection flow={flow} TotpSettingsSectionWrapper={TotpSettingsSectionWrapper} />
        }
    })()

    if (!$flow) return null

    return (
        <UserAuthForm className={className} flow={flow} onSubmit={onSubmit}>
            <UiMessages uiMessages={flow.ui.messages} />
            {$flow}
        </UserAuthForm>
    )
}
