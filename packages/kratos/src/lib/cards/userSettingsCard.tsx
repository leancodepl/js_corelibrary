import { ElementType, JSX } from "react";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm";
import { useScriptNodes } from "../helpers/useScriptNodes";
import { hasLookupSecret, hasOidc, hasPassword, hasTotp, hasWebauthn } from "../helpers/utils";
import { useKratosContext } from "../kratosContext";
import { LookupSecretSettingsSection } from "../sections/lookupSecretSettingsSection";
import { OidcSettingsSection } from "../sections/oidcSettingsSection";
import { PasswordSettingsSection } from "../sections/passwordSettingsSection";
import { ProfileSettingsSection } from "../sections/profileSettingsSection";
import { TotpSettingsSection } from "../sections/totpSettingsSection";
import { WebAuthnSettingsSection } from "../sections/webAuthnSettingsSection";

export type UserSettingsFlowType = "profile" | "password" | "totp" | "webauthn" | "oidc" | "lookupSecret";

export type UserSettingsCardProps = {
    flow: SettingsFlow;
    flowType: UserSettingsFlowType;
    includeScripts?: boolean;
    className?: string;

    ProfileSettingsSectionWrapper?: ElementType;
    PasswordSettingsSectionWrapper?: ElementType;
    WebAuthnSettingsSectionWrapper?: ElementType;
    LookupSecretSettingsSectionWrapper?: ElementType;
    OidcSettingsSectionWrapper?: ElementType;
    TotpSettingsSectionWrapper?: ElementType;
} & UserAuthFormAdditionalProps<UpdateSettingsFlowBody>;

export const UserSettingsCard = ({
    flow,
    flowType,
    includeScripts,
    onSubmit,
    className,

    ProfileSettingsSectionWrapper,
    PasswordSettingsSectionWrapper,
    WebAuthnSettingsSectionWrapper,
    LookupSecretSettingsSectionWrapper,
    OidcSettingsSectionWrapper,
    TotpSettingsSectionWrapper,
}: UserSettingsCardProps): JSX.Element | null => {
    if (includeScripts) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useScriptNodes({ nodes: flow.ui.nodes });
    }

    const { components } = useKratosContext();

    ProfileSettingsSectionWrapper ??= components.ProfileSettingsSectionWrapper;
    PasswordSettingsSectionWrapper ??= components.PasswordSettingsSectionWrapper;
    WebAuthnSettingsSectionWrapper ??= components.WebAuthnSettingsSectionWrapper;
    LookupSecretSettingsSectionWrapper ??= components.LookupSecretSettingsSectionWrapper;
    OidcSettingsSectionWrapper ??= components.OidcSettingsSectionWrapper;
    TotpSettingsSectionWrapper ??= components.TotpSettingsSectionWrapper;

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
            {$flow}
        </UserAuthForm>
    );
};
