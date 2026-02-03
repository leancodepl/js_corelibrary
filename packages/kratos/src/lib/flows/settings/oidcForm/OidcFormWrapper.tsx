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
}

export function OidcFormWrapper<TOidcProvidersConfig extends OidcProvidersConfig = readonly []>({
  oidcForm: OidcForm,
}: OidcFormWrapperProps<TOidcProvidersConfig>) {
  const { data: settingsFlow } = useGetSettingsFlow()

  const oidcComponents = useMemo(() => {
    if (!settingsFlow) {
      return { isLoading: true } as OidcFormProps<TOidcProvidersConfig>
    }

    const availableProviders = getAllOidcProviderUiNodes(settingsFlow.ui.nodes)
    const components: Record<string, boolean | ComponentType<{ children: ReactNode }>> = {
      isLoading: false,
    }

    availableProviders.forEach(node => {
      const providerId = node.attributes.value
      const providerName = toUpperFirst(providerId)
      const type = getOidcProviderType(providerId, settingsFlow.ui.nodes)

      if (type) {
        components[providerName] = ({ children }: { children: ReactNode }) => (
          <Oidc provider={providerId} type={type}>
            {children}
          </Oidc>
        )
      }
    })

    return components as OidcFormProps<TOidcProvidersConfig>
  }, [settingsFlow])

  return <OidcForm {...oidcComponents} />
}
