import { ElementType, JSX } from "react";
import {
    LoginFlow,
    RecoveryFlow,
    RegistrationFlow,
    UpdateLoginFlowBody,
    UpdateRecoveryFlowBody,
    UpdateRegistrationFlowBody,
    UpdateVerificationFlowBody,
    VerificationFlow,
} from "@ory/client";
import { FilterFlowNodes } from "../helpers/filterFlowNodes";
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm";
import { useScriptNodes } from "../helpers/useScriptNodes";
import { hasCode, hasLookupSecret, hasOidc, hasPassword, hasTotp, hasWebauthn } from "../helpers/utils";
import { useKratosContext } from "../kratosContext";
import { AuthCodeSection } from "../sections/authCodeSection";
import { LinkSection } from "../sections/linkSection";
import { LoginSection } from "../sections/loginSection";
import { OidcSection } from "../sections/oidcSection";
import { PasswordlessSection } from "../sections/passwordlessSection";
import { RegistrationSection } from "../sections/registrationSection";

type UserAuthCardProps<TBody> = {
    className?: string;
    flow: LoginFlow | RegistrationFlow | RecoveryFlow | VerificationFlow;
    flowType: "login" | "registration" | "recovery" | "verification";
    includeScripts?: boolean;

    OidcSectionWrapper?: ElementType;
    PasswordlessSectionWrapper?: ElementType;
    AuthCodeSectionWrapper?: ElementType;
    LoginSectionWrapper?: ElementType;
    RegistrationSectionWrapper?: ElementType;
    LinkSectionWrapper?: ElementType;
} & UserAuthFormAdditionalProps<TBody>;

/**
 * UserAuthCard renders a login, registration, verification or recovery flow
 * it can also handle multi factor authentication on login flows
 * @param UserAuthCardProps - a card that renders a login, registration, verification or recovery flow
 * @returns JSX.Element
 */
function UserAuthCard<TBody>({
    flow,
    flowType,
    onSubmit,
    includeScripts,
    className,
    OidcSectionWrapper,
    PasswordlessSectionWrapper,
    AuthCodeSectionWrapper,
    LoginSectionWrapper,
    RegistrationSectionWrapper,
    LinkSectionWrapper,
}: UserAuthCardProps<TBody>) {
    if (includeScripts) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useScriptNodes({ nodes: flow.ui.nodes });
    }

    let $flow: JSX.Element | undefined = undefined;
    let $oidc: JSX.Element | undefined = undefined;
    let $code: JSX.Element | undefined = undefined;
    let $passwordless: JSX.Element | undefined = undefined;

    // passwordless can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
    // we want the login section to handle passwordless as well when we have a 2FA screen.
    const canShowPasswordless = () =>
        !!$passwordless && (!isLoggedIn(flow as LoginFlow) || flowType === "registration");

    // the current flow is a two factor flow if the user is logged in and has any of the second factor methods enabled.
    const isTwoFactor = () =>
        flowType === "login" &&
        isLoggedIn(flow) &&
        (hasTotp(flow.ui.nodes) || hasWebauthn(flow.ui.nodes) || hasLookupSecret(flow.ui.nodes));

    const { components } = useKratosContext();
    OidcSectionWrapper ??= components.OidcSectionWrapper;
    PasswordlessSectionWrapper ??= components.PasswordlessSectionWrapper;
    AuthCodeSectionWrapper ??= components.AuthCodeSectionWrapper;
    LoginSectionWrapper ??= components.LoginSectionWrapper;
    RegistrationSectionWrapper ??= components.RegistrationSectionWrapper;
    LinkSectionWrapper ??= components.LinkSectionWrapper;

    // This function will map all the 2fa flows with their own respective forms.
    // It also helps with spacing them and adding visual dividers between each flow *if* there are more than one flow.
    const twoFactorFlows = () =>
        isTwoFactor() &&
        [
            hasWebauthn(flow.ui.nodes) && (
                <UserAuthForm flow={flow}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: "webauthn",
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
            hasPassword(flow.ui.nodes) && (
                <UserAuthForm flow={flow}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: "password",
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
            hasTotp(flow.ui.nodes) && (
                <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: "totp",
                            withoutDefaultGroup: true,
                            excludeAttributes: "submit",
                        }}
                    />

                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: "totp",
                            withoutDefaultGroup: true,
                            attributes: "submit",
                        }}
                    />
                </UserAuthForm>
            ),
            hasLookupSecret(flow.ui.nodes) && (
                <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: "lookup_secret",
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
        ].filter(Boolean); // remove nulls

    switch (flowType) {
        case "login":
            $passwordless = hasWebauthn(flow.ui.nodes) ? (
                <PasswordlessSection flow={flow} PasswordlessSectionWrapper={PasswordlessSectionWrapper} />
            ) : undefined;
            $oidc = hasOidc(flow.ui.nodes) ? (
                <OidcSection flow={flow} OidcSectionWrapper={OidcSectionWrapper} />
            ) : undefined;
            $code = hasCode(flow.ui.nodes) ? (
                <AuthCodeSection AuthCodeSectionWrapper={AuthCodeSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined;
            $flow = hasPassword(flow.ui.nodes) ? (
                <LoginSection LoginSectionWrapper={LoginSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined;

            break;
        case "registration":
            $passwordless = hasWebauthn(flow.ui.nodes) ? (
                <PasswordlessSection flow={flow} PasswordlessSectionWrapper={PasswordlessSectionWrapper} />
            ) : undefined;
            $oidc = hasOidc(flow.ui.nodes) ? (
                <OidcSection flow={flow} OidcSectionWrapper={OidcSectionWrapper} />
            ) : undefined;
            $code = hasCode(flow.ui.nodes) ? (
                <AuthCodeSection AuthCodeSectionWrapper={AuthCodeSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined;
            $flow = hasPassword(flow.ui.nodes) ? (
                <RegistrationSection nodes={flow.ui.nodes} RegistrationSectionWrapper={RegistrationSectionWrapper} />
            ) : undefined;

            break;
        // both verification and recovery use the same flow.
        case "recovery":
            $flow = <LinkSection LinkSectionWrapper={LinkSectionWrapper} nodes={flow.ui.nodes} />;

            break;
        case "verification":
            $flow = <LinkSection LinkSectionWrapper={LinkSectionWrapper} nodes={flow.ui.nodes} />;

            break;
    }

    return (
        <div className={className}>
            {/* <NodeMessages uiMessages={flow.ui.messages} /> */}
            {$oidc && <UserAuthForm flow={flow}>{$oidc}</UserAuthForm>}
            {$code && <UserAuthForm flow={flow}>{$code}</UserAuthForm>}
            {$flow && !isTwoFactor() && (
                <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
                    {$flow}
                </UserAuthForm>
            )}
            {isTwoFactor() && (
                <>
                    {/* <NodeMessages
                        nodes={filterNodesByGroups({
                            nodes: flow.ui.nodes,
                            groups: ["password", "webauthn", "totp", "lookup_secret"],
                        })}
                    /> */}
                    {twoFactorFlows()}
                </>
            )}

            {canShowPasswordless() && (
                <UserAuthForm
                    flow={flow}
                    formFilterOverride={{
                        nodes: flow.ui.nodes,
                        attributes: "hidden",
                    }}
                    submitOnEnter={true}
                    onSubmit={onSubmit}>
                    {$passwordless}
                </UserAuthForm>
            )}
        </div>
    );
}

function mkCard<TBody, TFlow extends UserAuthCardProps<TBody>["flow"]>(flowType: UserAuthCardProps<TBody>["flowType"]) {
    return function (props: Omit<UserAuthCardProps<TBody>, "flow" | "flowType"> & { flow: TFlow }) {
        return <UserAuthCard flowType={flowType} {...props} />;
    };
}

export const LoginCard = mkCard<UpdateLoginFlowBody, LoginFlow>("login");
export const VerificationCard = mkCard<UpdateVerificationFlowBody, VerificationFlow>("verification");
export const RegistrationCard = mkCard<UpdateRegistrationFlowBody, RegistrationFlow>("registration");
export const RecoveryCard = mkCard<UpdateRecoveryFlowBody, RecoveryFlow>("recovery");

// the user might need to logout on the second factor page.
function isLoggedIn(flow: LoginFlow | RegistrationFlow | RecoveryFlow | VerificationFlow): boolean {
    if ("requested_aal" in flow && flow.requested_aal === "aal2") {
        return true;
    } else if ("refresh" in flow && flow.refresh) {
        return true;
    }
    return false;
}
