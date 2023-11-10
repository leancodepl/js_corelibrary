import { UiNode } from "@ory/client";
import { isUiNodeInputAttributes } from "./typeGuards";

export function getNodeId({ attributes }: UiNode) {
    if (isUiNodeInputAttributes(attributes)) {
        return attributes.name;
    } else {
        return attributes.id;
    }
}
