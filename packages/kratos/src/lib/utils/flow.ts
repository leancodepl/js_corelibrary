import {
    getNodeId,
    isUiNodeInputAttributes,
    UiNode,
    UiNodeGroupEnum,
    UiNodeScriptAttributesNodeTypeEnum,
    UiNodeTypeEnum,
} from "../kratos"

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

export const getNodesOfGroup = <TGroup extends UiNodeGroupEnum>(nodes: UiNode[], group: TGroup) => {
    return nodes.filter(node => node.group === group) as (UiNode & { group: TGroup })[]
}

export const isPasskeyRemoveUiNode = (
    node: UiNode,
): node is UiNode & {
    group: typeof UiNodeGroupEnum.Passkey
    type: typeof UiNodeTypeEnum.Input
    attributes: {
        node_type: typeof UiNodeScriptAttributesNodeTypeEnum.Input
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
    if (
        node.group !== UiNodeGroupEnum.Passkey ||
        node.type !== UiNodeTypeEnum.Input ||
        node.attributes.node_type !== UiNodeScriptAttributesNodeTypeEnum.Input ||
        node.attributes.name !== "passkey_remove" ||
        !node.meta?.label?.context
    ) {
        return false
    }

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
