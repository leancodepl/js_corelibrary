import { UiNode } from "../../../kratos"

export const providers = ["apple", "facebook", "google"] as const

export type OidcProvider = (typeof providers)[number]

export const getOidcProviderType = (provider: OidcProvider, nodes: UiNode[]): "link" | "unlink" | undefined => {
    const node = nodes.find(
        node =>
            node.attributes.node_type === "input" &&
            node.attributes.name === "link" &&
            node.attributes.value === provider,
    )

    if (node) {
        return "link"
    }

    const unlinkNode = nodes.find(
        node =>
            node.attributes.node_type === "input" &&
            node.attributes.name === "unlink" &&
            node.attributes.value === provider,
    )

    if (unlinkNode) {
        return "unlink"
    }

    return undefined
}
