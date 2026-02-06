import { ComponentType, ReactNode, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { getAllOidcProviderUiNodes, OidcProviderComponents, OidcProvidersConfig } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { Oidc } from "./fields"
import { getOidcProviderType } from "./providers"

export type OidcFormProps<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = OidcProviderComponents<TOidcProvidersConfig> & {
  isLoading: boolean
}

type OidcFormWrapperProps<TOidcProvidersConfig extends OidcProvidersConfig = readonly []> = {
  oidcForm: ComponentType<OidcFormProps<TOidcProvidersConfig>>
  oidcProvidersConfig?: TOidcProvidersConfig
}

export function OidcFormWrapper<TOidcProvidersConfig extends OidcProvidersConfig = readonly []>({
  oidcForm: OidcForm,
  oidcProvidersConfig,
}: OidcFormWrapperProps<TOidcProvidersConfig>) {
  const { data: settingsFlow } = useGetSettingsFlow()

  const oidcComponents = useMemo<OidcFormProps<TOidcProvidersConfig>>(() => {
    if (!settingsFlow) {
      return { isLoading: true }
    }

    const availableProviders = getAllOidcProviderUiNodes(settingsFlow.ui.nodes)
    const configuredProviderIds = new Set(oidcProvidersConfig?.map(p => p.id) ?? [])
    const providerComponents: Record<string, ComponentType<{ children: ReactNode }>> = {}

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      const type = getOidcProviderType(providerId, settingsFlow.ui.nodes)

      // Only include providers that are both available in the flow and configured (or all if no config)
      if (type && (configuredProviderIds.size === 0 || configuredProviderIds.has(providerId))) {
        const providerName = toUpperFirst(providerId)
        
        providerComponents[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId} type={type}>
            {children}
          </Oidc>
        )
      }
    })

    return {
      isLoading: false,
      ...providerComponents,
    } as OidcFormProps<TOidcProvidersConfig>
  }, [settingsFlow, oidcProvidersConfig])

  return <OidcForm {...oidcComponents} />
}
