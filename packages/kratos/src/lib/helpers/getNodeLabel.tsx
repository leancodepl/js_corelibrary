import { UiNode, UiText } from "@ory/client";
import { isUiNodeAnchorAttributes, isUiNodeImageAttributes, isUiNodeInputAttributes } from "@ory/integrations/ui";

export const getNodeLabel = (node: UiNode): UiText | undefined => {
    const attributes = node.attributes;
    if (isUiNodeAnchorAttributes(attributes)) {
        return attributes.title;
    }

    if (isUiNodeImageAttributes(attributes)) {
        return node.meta.label;
    }

    if (isUiNodeInputAttributes(attributes)) {
        if (attributes.label) {
            return attributes.label;
        }
    }

    return node.meta.label;
};
