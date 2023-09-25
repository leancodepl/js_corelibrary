import { UiNode, UiNodeAnchorAttributes } from "@ory/kratos-client";

type DefaultNodeAnchorProps = {
    node: UiNode;
    attributes: UiNodeAnchorAttributes;
};

export function DefaultNodeAnchor({ attributes, node }: DefaultNodeAnchorProps) {
    return (
        <a href={attributes.href} title={attributes.title.text}>
            {attributes.title.text}
        </a>
    );
}
