import { JSX } from "react";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm";
import { useScriptNodes } from "../helpers/useScriptNodes";
import { useKratosContext } from "../kratosContext";
import { LookupSecretSettingsSection } from "../sections/lookupSecretSettingsSection";
import { OidcSettingsSection } from "../sections/oidcSettingsSection";
import { PasswordSettingsSection } from "../sections/passwordSettingsSection";
import { ProfileSettingsSection } from "../sections/profileSettingsSection";
import { TotpSettingsSection } from "../sections/totpSettingsSection";
import { WebAuthnSettingsSection } from "../sections/webAuthnSettingsSection";
import { hasLookupSecret, hasOidc, hasPassword, hasTotp, hasWebauthn } from "../utils/helpers";

export type UserSettingsFlowType = "lookupSecret" | "oidc" | "password" | "profile" | "totp" | "webauthn";

export type UserSettingsCardProps = {
    flow: SettingsFlow;
    flowType: UserSettingsFlowType;
    className?: string;
} & UserAuthFormAdditionalProps<UpdateSettingsFlowBody>;

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
    } = useKratosContext();

    useScriptNodes({ nodes: flow.ui.nodes, excludeScripts });

    const $flow = (() => {
        if (flowType === "profile") {
            return <ProfileSettingsSection flow={flow} ProfileSettingsSectionWrapper={ProfileSettingsSectionWrapper} />;
        } else if (flowType === "password" && hasPassword(flow.ui.nodes)) {
            return (
                <PasswordSettingsSection flow={flow} PasswordSettingsSectionWrapper={PasswordSettingsSectionWrapper} />
            );
        } else if (flowType === "webauthn" && hasWebauthn(flow.ui.nodes)) {
            return (
                <WebAuthnSettingsSection flow={flow} WebAuthnSettingsSectionWrapper={WebAuthnSettingsSectionWrapper} />
            );
        } else if (flowType === "lookupSecret" && hasLookupSecret(flow.ui.nodes)) {
            return (
                <LookupSecretSettingsSection
                    flow={flow}
                    LookupSecretSettingsSectionWrapper={LookupSecretSettingsSectionWrapper}
                />
            );
        } else if (flowType === "oidc" && hasOidc(flow.ui.nodes)) {
            return <OidcSettingsSection flow={flow} OidcSettingsSectionWrapper={OidcSettingsSectionWrapper} />;
        } else if (flowType === "totp" && hasTotp(flow.ui.nodes)) {
            return <TotpSettingsSection flow={flow} TotpSettingsSectionWrapper={TotpSettingsSectionWrapper} />;
        }
    })();

    if (!$flow) return null;

    return (
        <UserAuthForm className={className} flow={flow} onSubmit={onSubmit}>
            <UiMessages uiMessages={flow.ui.messages} />
            {$flow}
        </UserAuthForm>
    );
}
