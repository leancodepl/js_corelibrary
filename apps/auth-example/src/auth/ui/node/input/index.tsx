import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { NodeInputCheckbox } from "./nodeInputCheckbox";
import { NodeInputDefault } from "./nodeInputDefault";
import { NodeInputHidden } from "./nodeInputHidden";
import { NodeInputPassword } from "./nodeInputPassword";
import { NodeInputSubmit } from "./nodeInputSubmit";

type NodeInputProps = {
    node: UiNode;
    attributes: UiNodeInputAttributes;
    disabled: boolean;
};

export function NodeInput({ attributes, node, disabled }: NodeInputProps) {
    switch (attributes.type) {
        case "hidden":
            return <NodeInputHidden attributes={attributes} />;
        case "checkbox":
            return <NodeInputCheckbox attributes={attributes} disabled={disabled} node={node} />;
        case "submit":
            return <NodeInputSubmit attributes={attributes} disabled={disabled} node={node} />;
        case "password":
            return <NodeInputPassword attributes={attributes} disabled={disabled} node={node} />;
    }

    return <NodeInputDefault attributes={attributes} disabled={disabled} node={node} />;
}
