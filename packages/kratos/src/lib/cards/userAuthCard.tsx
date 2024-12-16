import { JSX } from "react"
import {
    AuthenticatorAssuranceLevel,
    LoginFlow,
    RecoveryFlow,
    RegistrationFlow,
    UiNodeGroupEnum,
    UpdateLoginFlowBody,
    UpdateRecoveryFlowBody,
    UpdateRegistrationFlowBody,
    UpdateVerificationFlowBody,
    VerificationFlow,
} from "../kratos"
import { NodeMessages } from "../helpers/errorMessages"
import { FilterFlowNodes } from "../helpers/filterFlowNodes"
import { UserAuthForm, UserAuthFormAdditionalProps } from "../helpers/userAuthForm"
import { useScriptNodes } from "../helpers/useScriptNodes"
import { useKratosContext } from "../kratosContext"
import { AuthCodeSection } from "../sections/authCodeSection"
import { IdentifierFirstLoginSection } from "../sections/identifierFirstLoginSection"
import { LinkSection } from "../sections/linkSection"
import { LoginSection } from "../sections/loginSection"
import { OidcSection } from "../sections/oidcSection"
import { PasswordlessSection } from "../sections/passwordlessSection"
import { ProfileLoginSection } from "../sections/profileLoginSection"
import { ProfileRegistrationSection } from "../sections/profileRegistrationSection"
import { RegistrationSection } from "../sections/registrationSection"
import { filterNodesByGroups } from "../utils/filterNodesByGroups"
import {
    hasCode,
    hasDefault,
    hasIdentifierFirst,
    hasLookupSecret,
    hasOidc,
    hasPasskey,
    hasPassword,
    hasProfile,
    hasTotp,
} from "../utils/helpers"

type UserAuthCardProps<TBody> = {
    className?: string
    flow: LoginFlow | RecoveryFlow | RegistrationFlow | VerificationFlow
    flowType: "login" | "recovery" | "registration" | "verification"
} & UserAuthFormAdditionalProps<TBody>

/**
 * UserAuthCard renders a login, registration, verification or recovery flow
 * it can also handle multi factor authentication on login flows
 * @param UserAuthCardProps - a card that renders a login, registration, verification or recovery flow
 * @returns JSX.Element
 */
function UserAuthCard<TBody>({ flow, flowType, onSubmit, className }: UserAuthCardProps<TBody>) {
    const {
        components: {
            PasswordlessSectionWrapper,
            OidcSectionWrapper,
            AuthCodeSectionWrapper,
            LoginSectionWrapper,
            RegistrationSectionWrapper,
            UiMessages,
            LinkSectionWrapper,
            IdentifierFirstLoginSectionWrapper,
            ProfileLoginSectionWrapper,
            ProfileRegistrationSectionWrapper,
        },
        excludeScripts,
    } = useKratosContext()

    useScriptNodes({ nodes: flow.ui.nodes, excludeScripts })

    let $flow: JSX.Element | undefined = undefined
    let $oidc: JSX.Element | undefined = undefined
    let $code: JSX.Element | undefined = undefined
    let $passkey: JSX.Element | undefined = undefined
    let $twoStep: JSX.Element | undefined = undefined
    let $profile: JSX.Element | undefined = undefined

    // the current flow is a two factor flow if the user is logged in and has any of the second factor methods enabled.
    const isTwoFactor =
        flowType === "login" &&
        isLoggedIn(flow) &&
        (hasTotp(flow.ui.nodes) || hasPasskey(flow.ui.nodes) || hasLookupSecret(flow.ui.nodes))

    // This array contains all the 2fa flows mapped to their own respective forms.
    const twoFactorFlows =
        isTwoFactor &&
        [
            hasPasskey(flow.ui.nodes) && (
                <UserAuthForm flow={flow}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: UiNodeGroupEnum.Passkey,
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
                            groups: UiNodeGroupEnum.Password,
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
            hasProfile(flow.ui.nodes) && (
                <UserAuthForm flow={flow}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: UiNodeGroupEnum.Profile,
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
            hasTotp(flow.ui.nodes) && (
                <UserAuthForm submitOnEnter flow={flow} onSubmit={onSubmit}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: UiNodeGroupEnum.Totp,
                            withoutDefaultGroup: true,
                            excludeAttributes: "submit",
                        }}
                    />

                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: UiNodeGroupEnum.Totp,
                            withoutDefaultGroup: true,
                            attributes: "submit",
                        }}
                    />
                </UserAuthForm>
            ),
            hasLookupSecret(flow.ui.nodes) && (
                <UserAuthForm submitOnEnter flow={flow} onSubmit={onSubmit}>
                    <FilterFlowNodes
                        filter={{
                            nodes: flow.ui.nodes,
                            groups: UiNodeGroupEnum.LookupSecret,
                            withoutDefaultGroup: true,
                        }}
                    />
                </UserAuthForm>
            ),
        ].filter(Boolean) // remove nulls

    switch (flowType) {
        case "login":
            $oidc = hasOidc(flow.ui.nodes) ? (
                <OidcSection flow={flow} OidcSectionWrapper={OidcSectionWrapper} />
            ) : undefined
            $passkey = hasPasskey(flow.ui.nodes) ? (
                <PasswordlessSection flow={flow} PasswordlessSectionWrapper={PasswordlessSectionWrapper} />
            ) : undefined
            $twoStep = hasIdentifierFirst(flow.ui.nodes) ? (
                <IdentifierFirstLoginSection
                    IdentifierFirstLoginSectionWrapper={IdentifierFirstLoginSectionWrapper}
                    nodes={flow.ui.nodes}
                />
            ) : undefined
            $profile = hasProfile(flow.ui.nodes) ? (
                <ProfileLoginSection nodes={flow.ui.nodes} ProfileLoginSectionWrapper={ProfileLoginSectionWrapper} />
            ) : undefined
            $flow = hasPassword(flow.ui.nodes) ? (
                <LoginSection LoginSectionWrapper={LoginSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined
            $code = hasCode(flow.ui.nodes) ? (
                <AuthCodeSection AuthCodeSectionWrapper={AuthCodeSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined

            break
        case "registration":
            $passkey = hasPasskey(flow.ui.nodes) ? (
                <PasswordlessSection flow={flow} PasswordlessSectionWrapper={PasswordlessSectionWrapper} />
            ) : undefined
            $profile = hasProfile(flow.ui.nodes) ? (
                <ProfileRegistrationSection
                    nodes={flow.ui.nodes}
                    ProfileRegistrationSectionWrapper={ProfileRegistrationSectionWrapper}
                />
            ) : undefined
            $oidc = hasOidc(flow.ui.nodes) ? (
                <OidcSection flow={flow} OidcSectionWrapper={OidcSectionWrapper} />
            ) : undefined
            $code = hasCode(flow.ui.nodes) ? (
                <AuthCodeSection AuthCodeSectionWrapper={AuthCodeSectionWrapper} nodes={flow.ui.nodes} />
            ) : undefined
            $flow =
                hasDefault(flow.ui.nodes) || hasPassword(flow.ui.nodes) ? (
                    <RegistrationSection
                        nodes={flow.ui.nodes}
                        RegistrationSectionWrapper={RegistrationSectionWrapper}
                    />
                ) : undefined

            break
        // both verification and recovery use the same flow.
        case "recovery":
        case "verification":
            $flow = <LinkSection LinkSectionWrapper={LinkSectionWrapper} nodes={flow.ui.nodes} />

            break
    }

    const canShowPasskey = !!$passkey && (!isLoggedIn(flow) || flowType === "registration")
    const canShowProfile = !!$profile && hasProfile(flow.ui.nodes)

    return (
        <div className={className}>
            <UiMessages uiMessages={flow.ui.messages} />
            {$oidc && <UserAuthForm flow={flow}>{$oidc}</UserAuthForm>}
            {$twoStep && <UserAuthForm flow={flow}>{$twoStep}</UserAuthForm>}
            {canShowPasskey && (
                <UserAuthForm submitOnEnter flow={flow} onSubmit={onSubmit}>
                    {$passkey}
                </UserAuthForm>
            )}
            {$code && <UserAuthForm flow={flow}>{$code}</UserAuthForm>}
            {$flow && !isTwoFactor && (
                <UserAuthForm submitOnEnter flow={flow} onSubmit={onSubmit}>
                    {$flow}
                </UserAuthForm>
            )}
            {isTwoFactor && (
                <>
                    <NodeMessages
                        nodes={filterNodesByGroups({
                            nodes: flow.ui.nodes,
                            groups: [
                                UiNodeGroupEnum.Password,
                                UiNodeGroupEnum.Webauthn,
                                UiNodeGroupEnum.Passkey,
                                UiNodeGroupEnum.Totp,
                                UiNodeGroupEnum.LookupSecret,
                            ],
                        })}
                    />
                    {twoFactorFlows}
                </>
            )}
            {canShowProfile && <UserAuthForm flow={flow}>{$profile}</UserAuthForm>}
        </div>
    )
}

function mkCard<TBody, TFlow extends UserAuthCardProps<TBody>["flow"]>(flowType: UserAuthCardProps<TBody>["flowType"]) {
    return function ({ ...props }: { flow: TFlow } & Omit<UserAuthCardProps<TBody>, "flow" | "flowType">) {
        return <UserAuthCard flowType={flowType} {...props} />
    }
}

export const LoginCard = mkCard<UpdateLoginFlowBody, LoginFlow>("login")
export const VerificationCard = mkCard<UpdateVerificationFlowBody, VerificationFlow>("verification")
export const RegistrationCard = mkCard<UpdateRegistrationFlowBody, RegistrationFlow>("registration")
export const RecoveryCard = mkCard<UpdateRecoveryFlowBody, RecoveryFlow>("recovery")

// the user might need to logout on the second factor page.
function isLoggedIn(flow: LoginFlow | RecoveryFlow | RegistrationFlow | VerificationFlow): boolean {
    if ("requested_aal" in flow && flow.requested_aal === AuthenticatorAssuranceLevel.Aal2) {
        return true
    } else if ("refresh" in flow && flow.refresh) {
        return true
    }
    return false
}
