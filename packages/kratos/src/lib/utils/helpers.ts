import { UiNode, UiNodeGroupEnum } from "@ory/client"

export function hasOidc(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Oidc)
}

export function hasPassword(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Password)
}

export function hasDefault(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Default)
}

export function hasProfile(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Profile)
}

export function hasWebauthn(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Webauthn)
}

export function hasPasskey(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Passkey)
}

export function hasIdentifierFirst(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.IdentifierFirst)
}

export function hasLookupSecret(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.LookupSecret)
}

export function hasTotp(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Totp)
}

export function hasCode(nodes: UiNode[]) {
    return nodes.some(({ group }) => group === UiNodeGroupEnum.Code)
}

export function hasHiddenIdentifier(nodes: UiNode[]) {
    return nodes.some(
        ({ attributes }) => "name" in attributes && attributes.name === "identifier" && attributes.type === "hidden",
    )
}
