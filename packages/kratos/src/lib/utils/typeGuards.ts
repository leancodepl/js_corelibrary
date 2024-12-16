import { UiNodeTextAttributes, UiText } from "../kratos"

export type UiNodeTextSecretsAttributes = {
    text: { context: { secrets: UiText[] } } & Omit<UiText, "context">
} & Omit<UiNodeTextAttributes, "text">

export function isUiNodeTextSecretsAttributes(
    attributes: UiNodeTextAttributes,
): attributes is UiNodeTextSecretsAttributes {
    return attributes.text.id === 1050015
}
