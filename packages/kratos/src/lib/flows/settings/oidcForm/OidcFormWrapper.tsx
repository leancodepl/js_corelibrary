import { ComponentType, ReactNode, useMemo } from "react"
import { UiNodeGroupEnum } from "../../../kratos"
import { getNodesOfGroup } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { Oidc } from "./fields"
import { getOidcProviderType, OidcProvider, providers } from "./providers"

type OidcProviderComponents<TProvider extends string> = {
    [key in Capitalize<TProvider>]?: ComponentType<{ children: ReactNode }>
}

export type OidcFormProps = OidcProviderComponents<OidcProvider>

type OidcFormWrapperProps = {
    oidcForm: ComponentType<OidcFormProps>
}

export function OidcFormWrapper({ oidcForm: OidcForm }: OidcFormWrapperProps) {
    const { data: settingsFlow } = useGetSettingsFlow()

    const oidcComponents = useMemo(() => {
        if (!settingsFlow) {
            return {}
        }

        const oidcGroupNodes = getNodesOfGroup(settingsFlow.ui.nodes, UiNodeGroupEnum.Oidc)

        const oidcTypes = providers.reduce(
            (acc, provider) => {
                const type = getOidcProviderType(provider, oidcGroupNodes)

                if (type) {
                    acc[provider] = type
                }

                return acc
            },
            {} as Record<OidcProvider, "link" | "unlink">,
        )

        return providers.reduce((acc, provider) => {
            const providerName = (provider.charAt(0).toUpperCase() + provider.slice(1)) as Capitalize<OidcProvider>

            if (oidcTypes[provider]) {
                acc[providerName] = ({ children }: { children: ReactNode }) => (
                    <Oidc provider={provider} type={oidcTypes[provider]}>
                        {children}
                    </Oidc>
                )
            }

            return acc
        }, {} as OidcFormProps)
    }, [settingsFlow])

    return <OidcForm {...oidcComponents} />
}
