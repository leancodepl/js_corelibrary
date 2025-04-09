import { getNodeId, isUiNodeInputAttributes, UiNode } from "../kratos"

export function getNodeById(nodes: UiNode[] | undefined, name: string) {
    return nodes?.find(node => getNodeId(node) === name)
}

export function inputNodeAttributes(node?: UiNode) {
    if (!node) return undefined

    if (isUiNodeInputAttributes(node.attributes)) return node.attributes

    return undefined
}

export function getCsrfToken(flow: { ui: { nodes: UiNode[] } }) {
    const attributes = inputNodeAttributes(getNodeById(flow.ui.nodes, "csrf_token"))

    if (!attributes || typeof attributes.value !== "string") throw new Error("CSRF token not found")

    return attributes.value
}
