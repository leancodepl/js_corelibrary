import { ComponentType, ReactNode, useMemo } from "react"
import { toUpperFirst } from "@leancodepl/utils"
import { getAllOidcProviderUiNodes } from "../../../utils"
import { useGetSettingsFlow } from "../hooks"
import { Oidc } from "./fields"
import { getOidcProviderType } from "./providers"

export type OidcFormProps = {
  [key: string]: ComponentType<{ children: ReactNode }> | undefined
  isLoading: boolean
}

type OidcFormWrapperProps = {
  oidcForm: ComponentType<OidcFormProps>
}

export function OidcFormWrapper({ oidcForm: OidcForm }: OidcFormWrapperProps) {
  const { data: settingsFlow } = useGetSettingsFlow()

  const oidcComponents = useMemo(() => {
    if (!settingsFlow) {
      return { isLoading: true }
    }

    const availableProviders = getAllOidcProviderUiNodes(settingsFlow.ui.nodes)
    const components: OidcFormProps = { isLoading: false }

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

    return components
  }, [settingsFlow])

  return <OidcForm {...oidcComponents} />
}
