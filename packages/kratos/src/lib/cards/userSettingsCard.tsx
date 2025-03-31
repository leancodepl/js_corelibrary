import { JSX } from "react"
import { SettingsFlow, UiNodeGroupEnum, UpdateSettingsFlowBody } from "@ory/client"
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm"
import { useScriptNodes } from "../helpers/useScriptNodes"
import { useKratosContext } from "../kratosContext"
import { LookupSecretSettingsSection } from "../sections/lookupSecretSettingsSection"
import { OidcSettingsSection } from "../sections/oidcSettingsSection"
import { PasskeySettingsSection } from "../sections/passkeySettingsSection"
import { PasswordSettingsSection } from "../sections/passwordSettingsSection"
import { ProfileSettingsSection } from "../sections/profileSettingsSection"
import { TotpSettingsSection } from "../sections/totpSettingsSection"
import { hasLookupSecret, hasOidc, hasPasskey, hasPassword, hasTotp } from "../utils/helpers"

export type UserSettingsFlowType =
    | typeof UiNodeGroupEnum.LookupSecret
    | typeof UiNodeGroupEnum.Oidc
    | typeof UiNodeGroupEnum.Passkey
    | typeof UiNodeGroupEnum.Password
    | typeof UiNodeGroupEnum.Profile
    | typeof UiNodeGroupEnum.Totp

export type UserSettingsCardProps = UserAuthFormAdditionalProps<UpdateSettingsFlowBody> & {
    flow: SettingsFlow
    flowType: UserSettingsFlowType
    className?: string
}

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
        if (flowType === UiNodeGroupEnum.Profile) {
            return <ProfileSettingsSection flow={flow} ProfileSettingsSectionWrapper={ProfileSettingsSectionWrapper} />
        } else if (flowType === UiNodeGroupEnum.Password && hasPassword(flow.ui.nodes)) {
            return (
                <PasswordSettingsSection flow={flow} PasswordSettingsSectionWrapper={PasswordSettingsSectionWrapper} />
            )
        } else if (flowType === UiNodeGroupEnum.Passkey && hasPasskey(flow.ui.nodes)) {
            return <PasskeySettingsSection flow={flow} PasskeySettingsSectionWrapper={WebAuthnSettingsSectionWrapper} />
        } else if (flowType === UiNodeGroupEnum.LookupSecret && hasLookupSecret(flow.ui.nodes)) {
            return (
                <LookupSecretSettingsSection
                    flow={flow}
                    LookupSecretSettingsSectionWrapper={LookupSecretSettingsSectionWrapper}
                />
            )
        } else if (flowType === UiNodeGroupEnum.Oidc && hasOidc(flow.ui.nodes)) {
            return <OidcSettingsSection flow={flow} OidcSettingsSectionWrapper={OidcSettingsSectionWrapper} />
        } else if (flowType === UiNodeGroupEnum.Totp && hasTotp(flow.ui.nodes)) {
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
