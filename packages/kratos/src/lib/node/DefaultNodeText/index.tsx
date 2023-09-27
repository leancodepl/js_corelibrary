import { UiNode, UiNodeTextAttributes } from "@ory/kratos-client";

type DefaultNodeTextProps = {
    node: UiNode;
    attributes: UiNodeTextAttributes;
};

export function DefaultNodeText({ attributes, node }: DefaultNodeTextProps) {
    return (
        <>
            <p>{node.meta.label?.text}</p>
            <Content attributes={attributes} node={node} />
        </>
    );
}

function Content({ attributes }: DefaultNodeTextProps) {
    return <p>{attributes.text.text}</p>;
}
