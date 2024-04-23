import {
    UiNodeAnchorAttributes,
    UiNodeAttributes,
    UiNodeImageAttributes,
    UiNodeInputAttributes,
    UiNodeScriptAttributes,
    UiNodeTextAttributes,
    UiText,
} from "@ory/client";

export function isUiNodeAnchorAttributes(
    attrs: UiNodeAttributes,
): attrs is { node_type: "a" } & UiNodeAnchorAttributes {
    return attrs.node_type === "a";
}

export function isUiNodeImageAttributes(
    attrs: UiNodeAttributes,
): attrs is { node_type: "img" } & UiNodeImageAttributes {
    return attrs.node_type === "img";
}

export function isUiNodeInputAttributes(
    attrs: UiNodeAttributes,
): attrs is { node_type: "input" } & UiNodeInputAttributes {
    return attrs.node_type === "input";
}

export function isUiNodeTextAttributes(attrs: UiNodeAttributes): attrs is { node_type: "text" } & UiNodeTextAttributes {
    return attrs.node_type === "text";
}

export function isUiNodeScriptAttributes(
    attrs: UiNodeAttributes,
): attrs is { node_type: "script" } & UiNodeScriptAttributes {
    return attrs.node_type === "script";
}

export type UiNodeTextSecretsAttributes = {
    text: { context: { secrets: UiText[] } } & Omit<UiText, "context">;
} & Omit<UiNodeTextAttributes, "text">;

export function isUiNodeTextSecretsAttributes(
    attributes: UiNodeTextAttributes,
): attributes is UiNodeTextSecretsAttributes {
    return attributes.text.id === 1050015;
}
