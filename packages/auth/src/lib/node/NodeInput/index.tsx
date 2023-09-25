import { ComponentType } from "react";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { DefaultNodeInputHidden } from "./defaultNodeInputHidden";

type NodeInputFactoryProps = {
    nodeInputs: {
        NodeInputHidden?: ComponentType<NodeInputHiddenProps>;
        NodeInputCheckbox: ComponentType<NodeInputProps>;
        NodeInputSubmit: ComponentType<NodeInputProps>;
        NodeInputPassword: ComponentType<NodeInputProps>;
        NodeInputDefault: ComponentType<NodeInputProps>;
    };
};

type NodeInputProps = {
    node: UiNode;
    attributes: UiNodeInputAttributes;
    disabled: boolean;
};

type NodeInputHiddenProps = Omit<NodeInputProps, "node" | "disabled">;

export function nodeInputFactory({
    nodeInputs: { NodeInputHidden, NodeInputCheckbox, NodeInputSubmit, NodeInputPassword, NodeInputDefault },
}: NodeInputFactoryProps) {
    return function NodeInput({ attributes, node, disabled }: NodeInputProps) {
        switch (attributes.type) {
            case "hidden":
                return NodeInputHidden ? (
                    <NodeInputHidden attributes={attributes} />
                ) : (
                    <DefaultNodeInputHidden attributes={attributes} />
                );
            case "checkbox":
                return <NodeInputCheckbox attributes={attributes} disabled={disabled} node={node} />;
            case "submit":
                return <NodeInputSubmit attributes={attributes} disabled={disabled} node={node} />;
            case "password":
                return <NodeInputPassword attributes={attributes} disabled={disabled} node={node} />;
        }

        return <NodeInputDefault attributes={attributes} disabled={disabled} node={node} />;
    };
}
