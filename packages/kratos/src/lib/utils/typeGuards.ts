import {
    UiNodeAnchorAttributes,
    UiNodeAttributes,
    UiNodeImageAttributes,
    UiNodeInputAttributes,
    UiNodeScriptAttributes,
    UiNodeTextAttributes,
    UiText,
} from "@ory/client"

export function isUiNodeAnchorAttributes(
    attrs: UiNodeAttributes,
): attrs is UiNodeAnchorAttributes & { node_type: "a" } {
    return attrs.node_type === "a"
}

export function isUiNodeImageAttributes(
    attrs: UiNodeAttributes,
): attrs is UiNodeImageAttributes & { node_type: "img" } {
    return attrs.node_type === "img"
}

export function isUiNodeInputAttributes(
    attrs: UiNodeAttributes,
): attrs is UiNodeInputAttributes & { node_type: "input" } {
    return attrs.node_type === "input"
}

export function isUiNodeTextAttributes(attrs: UiNodeAttributes): attrs is UiNodeTextAttributes & { node_type: "text" } {
    return attrs.node_type === "text"
}

export function isUiNodeScriptAttributes(
    attrs: UiNodeAttributes,
): attrs is UiNodeScriptAttributes & { node_type: "script" } {
    return attrs.node_type === "script"
}

export type UiNodeTextSecretsAttributes = Omit<UiNodeTextAttributes, "text"> & {
    text: Omit<UiText, "context"> & { context: { secrets: UiText[] } }
}

export function isUiNodeTextSecretsAttributes(
    attributes: UiNodeTextAttributes,
): attributes is UiNodeTextSecretsAttributes {
    return attributes.text.id === 1050015
}
