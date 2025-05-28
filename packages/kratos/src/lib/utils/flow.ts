import { getNodeId, isUiNodeInputAttributes, UiNode } from "../kratos"

export function getNodeById(nodes: UiNode[] | undefined, name: string) {
    return nodes?.find(node => getNodeId(node) === name)
}

export function getNodesById(nodes: UiNode[] | undefined, name: string) {
    return nodes?.filter(node => getNodeId(node) === name) ?? []
}

export function inputNodeAttributes(node?: UiNode) {
    if (!node) return undefined

    if (isUiNodeInputAttributes(node.attributes)) return node.attributes

    return undefined
}

export function inputNodeMessages(node?: UiNode) {
    if (!node) return undefined

    if (isUiNodeInputAttributes(node.attributes)) return node.messages

    return undefined
}

export function getCsrfToken(flow: { ui: { nodes: UiNode[] } }) {
    const attributes = inputNodeAttributes(getNodeById(flow.ui.nodes, "csrf_token"))

    if (!attributes || typeof attributes.value !== "string") throw new Error("CSRF token not found")

    return attributes.value
}

export const isPasskeyUiNode = (
    node: UiNode,
): node is UiNode & {
    group: "passkey"
    type: "input"
    attributes: {
        node_type: "input"
        name: "passkey_remove"
    }
    meta: {
        label: {
            context: {
                added_at: string
                display_name: string
                added_at_unix: number
            }
        }
    }
} => {
    if (node.group !== "passkey") return false
    if (node.type !== "input") return false
    if (node.attributes.node_type !== "input") return false
    if (node.attributes.name !== "passkey_remove") return false
    if (!node.meta?.label?.context) return false

    const { context } = node.meta.label

    return (
        "added_at" in context &&
        typeof context.added_at === "string" &&
        "display_name" in context &&
        typeof context.display_name === "string" &&
        "added_at_unix" in context &&
        typeof context.added_at_unix === "number"
    )
}
