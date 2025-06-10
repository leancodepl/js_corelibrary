import { UiNode } from "../../../kratos"

export const providers = ["apple", "facebook", "google"] as const

export type OidcProvider = (typeof providers)[number]

export const getOidcProviderType = (provider: OidcProvider, nodes: UiNode[]): "link" | "unlink" | undefined => {
    const node = nodes.find(
        (node): node is UiNode & { group: "oidc"; attributes: { node_type: "input"; value: OidcProvider } } =>
            node.group === "oidc" && node.attributes.node_type === "input" && node.attributes.value === provider,
    )

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
