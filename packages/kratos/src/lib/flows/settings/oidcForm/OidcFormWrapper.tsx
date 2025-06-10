import { ComponentType, ReactNode, useMemo } from "react"
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

        return providers.reduce((acc, provider) => {
            const providerName = (provider.charAt(0).toUpperCase() + provider.slice(1)) as Capitalize<OidcProvider>
            const type = getOidcProviderType(provider, settingsFlow.ui.nodes)

            if (type) {
                acc[providerName] = ({ children }: { children: ReactNode }) => (
                    <Oidc provider={provider} type={type}>
                        {children}
                    </Oidc>
                )
            }

            return acc
        }, {} as OidcFormProps)
    }, [settingsFlow])

    return <OidcForm {...oidcComponents} />
}
