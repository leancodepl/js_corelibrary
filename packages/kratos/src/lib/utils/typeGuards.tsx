import {
    UiNodeAnchorAttributes,
    UiNodeAttributes,
    UiNodeImageAttributes,
    UiNodeInputAttributes,
    UiNodeScriptAttributes,
    UiNodeTextAttributes,
} from "@ory/kratos-client";

export function isUiNodeAnchorAttributes(attrs: UiNodeAttributes): attrs is UiNodeAnchorAttributes {
    return attrs.node_type === "a";
}

export function isUiNodeImageAttributes(attrs: UiNodeAttributes): attrs is UiNodeImageAttributes {
    return attrs.node_type === "img";
}

export function isUiNodeInputAttributes(attrs: UiNodeAttributes): attrs is UiNodeInputAttributes {
    return attrs.node_type === "input";
}

export function isUiNodeTextAttributes(attrs: UiNodeAttributes): attrs is UiNodeTextAttributes {
    return attrs.node_type === "text";
}

export function isUiNodeScriptAttributes(attrs: UiNodeAttributes): attrs is UiNodeScriptAttributes {
    return attrs.node_type === "script";
}
