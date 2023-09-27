import { UiNode, UiNodeImageAttributes } from "@ory/kratos-client";

type DefaultNodeImageProps = {
    node: UiNode;
    attributes: UiNodeImageAttributes;
};

export function DefaultNodeImage({ attributes, node }: DefaultNodeImageProps) {
    return (
        <img
            alt={node.meta.label?.text || ""}
            height={attributes.height}
            src={attributes.src}
            width={attributes.width}
        />
    );
}
