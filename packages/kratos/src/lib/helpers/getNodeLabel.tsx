import { isUiNodeAnchorAttributes, isUiNodeImageAttributes, isUiNodeInputAttributes, UiNode, UiText } from "../kratos"

export const getNodeLabel = (node: UiNode): UiText | undefined => {
    const attributes = node.attributes
    if (isUiNodeAnchorAttributes(attributes)) {
        return attributes.title
    }

    if (isUiNodeImageAttributes(attributes)) {
        return node.meta.label
    }

    if (isUiNodeInputAttributes(attributes) && attributes.label) {
        return attributes.label
    }

    return node.meta.label
}
