import { UiNode } from "@ory/client";

export function hasOidc(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "oidc");
}

export function hasPassword(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "password");
}

export function hasWebauthn(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "webauthn");
}

export function hasLookupSecret(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "lookup_secret");
}

export function hasTotp(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "totp");
}

export function hasCode(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === "code");
}

export function hasHiddenIdentifier(nodes: UiNode[]) {
    return nodes.some(
        ({ attributes }) => "name" in attributes && attributes.name === "identifier" && attributes.type === "hidden",
    );
}
