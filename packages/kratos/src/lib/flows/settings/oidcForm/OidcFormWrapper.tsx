import { ComponentType, ReactNode, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { OidcProvider, providers } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { Oidc } from "./fields"
import { getOidcProviderType } from "./providers"

type OidcProviderComponents<TProvider extends string> = {
    [key in Capitalize<TProvider>]?: ComponentType<{ children: ReactNode }>
}

export type OidcFormProps = OidcProviderComponents<OidcProvider> & {
    isLoading: boolean
}

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
            const providerName = toUpperFirst(provider)
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

    return <OidcForm {...oidcComponents} isLoading={!settingsFlow} />
}
