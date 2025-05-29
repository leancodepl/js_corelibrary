import { ComponentType, ReactNode } from "react"
import { UiNode, UiNodeGroupEnum } from "../../../kratos"
import { useGetSettingsFlow } from "../hooks"
import { Apple, Facebook, Google, UnlinkApple, UnlinkFacebook, UnlinkGoogle } from "./fields"

export type OidcFormProps = {
    Apple?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
    UnlinkApple?: ComponentType<{ children: ReactNode }>
    UnlinkGoogle?: ComponentType<{ children: ReactNode }>
    UnlinkFacebook?: ComponentType<{ children: ReactNode }>
}

type OidcFormWrapperProps = {
    oidcForm: ComponentType<OidcFormProps>
}

const showOidcButton = (
    nodes: UiNode[],
    type: "link" | "unlink",
    provider: "apple" | "facebook" | "google",
): boolean => {
    return nodes.some(
        node =>
            node.attributes.node_type === "input" &&
            node.attributes.name === type &&
            node.attributes.value === provider,
    )
}

export function OidcFormWrapper({ oidcForm: OidcForm }: OidcFormWrapperProps) {
    const { data: settingsFlow } = useGetSettingsFlow()

    if (!settingsFlow) {
        return null
    }

    const oidcGroupNodes = settingsFlow.ui.nodes.filter(({ group }) => group === UiNodeGroupEnum.Oidc)

    return (
        <OidcForm
            Apple={showOidcButton(oidcGroupNodes, "link", "apple") ? Apple : undefined}
            Facebook={showOidcButton(oidcGroupNodes, "link", "facebook") ? Facebook : undefined}
            Google={showOidcButton(oidcGroupNodes, "link", "google") ? Google : undefined}
            UnlinkApple={showOidcButton(oidcGroupNodes, "unlink", "apple") ? UnlinkApple : undefined}
            UnlinkFacebook={showOidcButton(oidcGroupNodes, "unlink", "facebook") ? UnlinkFacebook : undefined}
            UnlinkGoogle={showOidcButton(oidcGroupNodes, "unlink", "google") ? UnlinkGoogle : undefined}
        />
    )
}
