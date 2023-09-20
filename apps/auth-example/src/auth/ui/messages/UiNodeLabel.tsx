import { isUiNodeAnchorAttributes, isUiNodeInputAttributes } from "@leancodepl/auth";
import { UiNode } from "@ory/kratos-client";
import { UiMessage } from "./UiMessage";

type UiNodeLabelProps = {
    node: UiNode;
};

export function UiNodeLabel({ node: { meta, attributes } }: UiNodeLabelProps) {
    if (isUiNodeAnchorAttributes(attributes)) return <UiMessage text={attributes.title} />;

    if (isUiNodeInputAttributes(attributes)) {
        if (attributes.label) return <UiMessage attributes={attributes} text={attributes.label} />;

        if (meta.label) return <UiMessage attributes={attributes} text={meta.label} />;
    }

    if (meta.label) return <UiMessage text={meta.label} />;

    return null;
}
