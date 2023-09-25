import { ComponentType } from "react";
import {
    UiNode,
    UiNodeAnchorAttributes,
    UiNodeImageAttributes,
    UiNodeInputAttributes,
    UiNodeScriptAttributes,
    UiNodeTextAttributes,
} from "@ory/kratos-client";
import { nodeInputFactory } from "./NodeInput";
import {
    isUiNodeAnchorAttributes,
    isUiNodeImageAttributes,
    isUiNodeInputAttributes,
    isUiNodeScriptAttributes,
    isUiNodeTextAttributes,
} from "../utils/typeGuards";

type NodeTextProps = {
    node: UiNode;
    attributes: UiNodeTextAttributes;
};

type NodeInputProps = {
    node: UiNode;
    attributes: UiNodeInputAttributes;
    disabled: boolean;
};

type NodeInputHiddenProps = Omit<NodeInputProps, "node" | "disabled">;

type NodeImageProps = {
    node: UiNode;
    attributes: UiNodeImageAttributes;
};

type NodeScriptProps = {
    node: UiNode;
    attributes: UiNodeScriptAttributes;
};

type NodeAnchorProps = {
    node: UiNode;
    attributes: UiNodeAnchorAttributes;
};

type NodeProps = {
    node: UiNode;
    disabled: boolean;
};

export type NodeFactoryProps = {
    nodeComponents: {
        nodeInputs: {
            NodeInputHidden?: ComponentType<NodeInputHiddenProps>;
            NodeInputCheckbox: ComponentType<NodeInputProps>;
            NodeInputSubmit: ComponentType<NodeInputProps>;
            NodeInputPassword: ComponentType<NodeInputProps>;
            NodeInputDefault: ComponentType<NodeInputProps>;
        };
        NodeText: ComponentType<NodeTextProps>;
        NodeImage?: ComponentType<NodeImageProps>;
        NodeScript?: ComponentType<NodeScriptProps>;
        NodeAnchor?: ComponentType<NodeAnchorProps>;
    };
};

export function nodeFactory({
    nodeComponents: { NodeImage, NodeText, NodeAnchor, NodeScript, nodeInputs },
}: NodeFactoryProps) {
    const NodeInput = nodeInputFactory({
        nodeInputs,
    });

    return function Node({ node, disabled }: NodeProps) {
        if (isUiNodeScriptAttributes(node.attributes)) {
            return NodeScript ? <NodeScript attributes={node.attributes} node={node} /> : null;
        }

        if (isUiNodeAnchorAttributes(node.attributes)) {
            return NodeAnchor ? <NodeAnchor attributes={node.attributes} node={node} /> : null;
        }

        if (isUiNodeImageAttributes(node.attributes)) {
            return NodeImage ? <NodeImage attributes={node.attributes} node={node} /> : null;
        }

        if (isUiNodeTextAttributes(node.attributes)) {
            return <NodeText attributes={node.attributes} node={node} />;
        }

        if (isUiNodeInputAttributes(node.attributes)) {
            return <NodeInput attributes={node.attributes} disabled={disabled} node={node} />;
        }

        return null;
    };
}
