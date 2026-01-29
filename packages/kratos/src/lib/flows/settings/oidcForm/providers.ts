import { UiNode } from "../../../kratos"
import { getOidcProviderUiNode } from "../../../utils"

export const getOidcProviderType = (provider: string, nodes: UiNode[]): "link" | "unlink" | undefined => {
  const node = getOidcProviderUiNode(nodes, provider)

  if (!node) {
    return undefined
  }

  if (node.attributes.name === "link") {
    return "link"
  }

  if (node.attributes.name === "unlink") {
    return "unlink"
  }

  throw new Error(`Unknown OIDC provider type for ${provider}: ${node.attributes.name}`)
}
