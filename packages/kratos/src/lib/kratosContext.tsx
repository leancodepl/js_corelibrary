import React, { ComponentType, ElementType, ReactNode, createContext, useContext, useMemo } from "react";
import { UiNode, UiNodeTextAttributes, UiText, UiTextTypeEnum } from "@ory/client";
import { DefaultButtonComponent } from "./defaultComponents/DefaultButtonComponent";
import { DefaultCheckboxComponent } from "./defaultComponents/DefaultCheckboxComponent";
import { DefaultImageComponent } from "./defaultComponents/DefaultImageComponent";
import { DefaultInputComponent } from "./defaultComponents/DefaultInputComponent";
import { DefaultLinkComponent } from "./defaultComponents/DefaultLinkComponent";
import { DefaultMessageComponent } from "./defaultComponents/DefaultMessageComponent";
import { DefaultMessageFormatComponent } from "./defaultComponents/DefaultMessageFormatComponent";
import { DefaultTextComponent } from "./defaultComponents/DefaultTextComponent";
import { DefaultUiMessagesComponent } from "./defaultComponents/DefaultUiMessagesComponent";
import { UseHandleFlowError } from "./types/useHandleFlowError";

export type ImageComponentProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    header?: ReactNode;
    className?: string;
};

export type TextComponentProps = {
    label?: ReactNode;
    id: string;
    codes?: UiText[];
    node: UiNode;
    attributes: UiNodeTextAttributes;
};

export type LinkComponentProps = {
    children?: ReactNode;
    href?: string;
    icon?: string;
    className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type InputComponentProps = {
    header: ReactNode;
    helperMessage?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type MessageComponentProps = {
    message: UiText;
    key: string;
    severity: Severity;
    children?: ReactNode;
};

export type Severity = UiTextTypeEnum | "disabled" | "default";

export type ButtonComponentProps = {
    header?: ReactNode;
    fullWidth?: boolean;
    social?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type CheckboxComponentProps = {
    label?: ReactNode;
    helperMessage?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

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

export type KratosContextData = {
    components: KratosComponents;
    useHandleFlowError: UseHandleFlowError;
};

const kratosContext = createContext<KratosContextData>({
    components: {
        Image: DefaultImageComponent,
        Text: DefaultTextComponent,
        Link: DefaultLinkComponent,
        Input: DefaultInputComponent,
        Message: DefaultMessageComponent,
        Button: DefaultButtonComponent,
        Checkbox: DefaultCheckboxComponent,
        UiMessages: DefaultUiMessagesComponent,

        MessageFormat: DefaultMessageFormatComponent,

        OidcSectionWrapper: "div",
        PasswordlessSectionWrapper: "div",
        AuthCodeSectionWrapper: "div",
        LoginSectionWrapper: "div",
        RegistrationSectionWrapper: "div",
        LinkSectionWrapper: "div",
        ProfileSettingsSectionWrapper: "div",
        PasswordSettingsSectionWrapper: "div",
        WebAuthnSettingsSectionWrapper: "div",
        LookupSecretSettingsSectionWrapper: "div",
        OidcSettingsSectionWrapper: "div",
        TotpSettingsSectionWrapper: "div",
    },
    useHandleFlowError: () => async () => undefined,
});

export function useKratosContext() {
    return useContext(kratosContext);
}

export type KratosContextProviderProps = {
    components?: Partial<KratosComponents>;
    useHandleFlowError?: UseHandleFlowError;
    children?: ReactNode;
};

export function KratosContextProvider({ components = {}, useHandleFlowError, children }: KratosContextProviderProps) {
    const { components: baseComponents, useHandleFlowError: baseUseHandleFlowError } = useKratosContext();

    const value = useMemo<KratosContextData>(
        () => ({
            components: {
                ...baseComponents,
                ...components,
            },
            useHandleFlowError: useHandleFlowError ?? baseUseHandleFlowError,
        }),
        [baseComponents, baseUseHandleFlowError, components, useHandleFlowError],
    );

    return <kratosContext.Provider value={value}>{children}</kratosContext.Provider>;
}
