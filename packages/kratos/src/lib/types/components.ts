import { ComponentType, ElementType, ReactNode } from "react";
import { UiNode, UiNodeTextAttributes, UiText, UiTextTypeEnum } from "@ory/client";

type Node = { node: UiNode };

export type ImageComponentProps = {
    header?: ReactNode;
    className?: string;
} & Node & React.ImgHTMLAttributes<HTMLImageElement>;

export type TextComponentProps = {
    label?: ReactNode;
    id: string;
    codes?: UiText[];
    attributes: UiNodeTextAttributes;
} & Node;

export type LinkComponentProps = {
    children?: ReactNode;
    href?: string;
    icon?: string;
    className?: string;
} & Node &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type InputComponentProps = {
    header: ReactNode;
    helperMessage?: ReactNode;
    isError?: boolean;
} & Node &
    React.InputHTMLAttributes<HTMLInputElement>;

export type MessageComponentProps = {
    message: UiText;
    key: string;
    severity: Severity;
    children?: ReactNode;
};

export type Severity = "default" | "disabled" | UiTextTypeEnum;

export type ButtonComponentProps = {
    header?: ReactNode;
    fullWidth?: boolean;
    social?: string;
} & Node &
    React.ButtonHTMLAttributes<HTMLButtonElement>;

export type CheckboxComponentProps = {
    label?: ReactNode;
    helperMessage?: ReactNode;
    isError?: boolean;
} & Node &
    React.InputHTMLAttributes<HTMLInputElement>;

export type MessageFormatComponentProps = {
    id: number;
    text: string;
    context?: object;
};

export type UiMessagesComponentProps = {
    uiMessages?: UiText[];
};

export type KratosComponents = {
    MessageFormat: ComponentType<MessageFormatComponentProps>;

    Image: ComponentType<ImageComponentProps>;
    Text: ComponentType<TextComponentProps>;
    Link: ComponentType<LinkComponentProps>;
    Input: ComponentType<InputComponentProps>;
    Message: ComponentType<MessageComponentProps>;
    Button: ComponentType<ButtonComponentProps>;
    Checkbox: ComponentType<CheckboxComponentProps>;
    UiMessages: ComponentType<UiMessagesComponentProps>;

    OidcSectionWrapper: ElementType;
    PasswordlessSectionWrapper: ElementType;
    AuthCodeSectionWrapper: ElementType;
    LoginSectionWrapper: ElementType;
    RegistrationSectionWrapper: ElementType;
    LinkSectionWrapper: ElementType;
    ProfileSettingsSectionWrapper: ElementType;
    PasswordSettingsSectionWrapper: ElementType;
    WebAuthnSettingsSectionWrapper: ElementType;
    LookupSecretSettingsSectionWrapper: ElementType;
    OidcSettingsSectionWrapper: ElementType;
    TotpSettingsSectionWrapper: ElementType;
};
