import { isUiNodeImageAttributes, isUiNodeInputAttributes, isUiNodeTextAttributes } from "@leancodepl/auth";
import { UiNode } from "@ory/kratos-client";
import { NodeImage } from "./image";
import { NodeInput } from "./input";
import { NodeText } from "./text";

type NodeProps = {
    node: UiNode;
    disabled: boolean;
};

export function Node({ node, disabled }: NodeProps) {
    // TODO: Implement those V

    // if (isUiNodeScriptAttributes(node.attributes)) {
    //     return <NodeScript attributes={node.attributes} node={node} />
    // }

    // if (isUiNodeAnchorAttributes(node.attributes)) {
    //     return <NodeAnchor attributes={node.attributes} node={node} />
    // }

    if (isUiNodeImageAttributes(node.attributes)) {
        return <NodeImage attributes={node.attributes} node={node} />;
    }

    if (isUiNodeTextAttributes(node.attributes)) {
        return <NodeText attributes={node.attributes} node={node} />;
    }

    if (isUiNodeInputAttributes(node.attributes)) {
        return <NodeInput attributes={node.attributes} disabled={disabled} node={node} />;
    }

    return null;
}
