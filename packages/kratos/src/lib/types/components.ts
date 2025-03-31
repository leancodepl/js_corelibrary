import { ComponentType, ElementType, ReactNode } from "react"
import { UiNode, UiNodeTextAttributes, UiText, UiTextTypeEnum } from "@ory/client"

type Node = { node: UiNode }

export type ImageComponentProps = Node &
    React.ImgHTMLAttributes<HTMLImageElement> & {
        header?: ReactNode
        className?: string
    }

export type TextComponentProps = Node & {
    label?: ReactNode
    id: string
    codes?: UiText[]
    attributes: UiNodeTextAttributes
}

export type LinkComponentProps = Node &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
        children?: ReactNode
        href?: string
        icon?: string
        className?: string
    }

export type InputComponentProps = Node &
    React.InputHTMLAttributes<HTMLInputElement> & {
        header: ReactNode
        helperMessage?: ReactNode
        isError?: boolean
    }

export type MessageComponentProps = {
    message: UiText
    key: string
    severity: Severity
    children?: ReactNode
}

export type Severity = "default" | "disabled" | UiTextTypeEnum

export type ButtonComponentProps = Node &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        header?: ReactNode
        fullWidth?: boolean
        social?: string
    }

export type CheckboxComponentProps = Node &
    React.InputHTMLAttributes<HTMLInputElement> & {
        label?: ReactNode
        helperMessage?: ReactNode
        isError?: boolean
    }

export type MessageFormatComponentProps = {
    id: number
    text: string
    context?: object
}

export type UiMessagesComponentProps = {
    uiMessages?: UiText[]
}

export type KratosComponents = {
    MessageFormat: ComponentType<MessageFormatComponentProps>

    Image: ComponentType<ImageComponentProps>
    Text: ComponentType<TextComponentProps>
    Link: ComponentType<LinkComponentProps>
    Input: ComponentType<InputComponentProps>
    Message: ComponentType<MessageComponentProps>
    Button: ComponentType<ButtonComponentProps>
    Checkbox: ComponentType<CheckboxComponentProps>
    UiMessages: ComponentType<UiMessagesComponentProps>

    OidcSectionWrapper: ElementType
    PasswordlessSectionWrapper: ElementType
    AuthCodeSectionWrapper: ElementType
    LoginSectionWrapper: ElementType
    RegistrationSectionWrapper: ElementType
    LinkSectionWrapper: ElementType
    ProfileSettingsSectionWrapper: ElementType
    PasswordSettingsSectionWrapper: ElementType
    WebAuthnSettingsSectionWrapper: ElementType
    LookupSecretSettingsSectionWrapper: ElementType
    OidcSettingsSectionWrapper: ElementType
    TotpSettingsSectionWrapper: ElementType
    IdentifierFirstLoginSectionWrapper: ElementType
    ProfileLoginSectionWrapper: ElementType
    ProfileRegistrationSectionWrapper: ElementType
}
