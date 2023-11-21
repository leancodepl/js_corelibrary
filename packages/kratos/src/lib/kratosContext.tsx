import React, { ComponentType, ElementType, ReactNode, createContext, useContext, useMemo } from "react";
import { UiNode, UiNodeTextAttributes, UiText, UiTextTypeEnum } from "@ory/client";
import { CustomHref } from "./types/customHref";
import { UseHandleFlowError } from "./types/useHandleFlowError";

export type ImageComponentProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    header?: ReactNode;
    className?: string;
};

export type TextComponentProps = {
    label?: ReactNode;
    children?: ReactNode;
    id: string;
    node: UiNode;
    attributes: UiNodeTextAttributes;
};

export type LinkComponentProps = {
    children?: ReactNode;
    href?: CustomHref | string;
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

export type KratosComponents = {
    MessageFormat: ComponentType<MessageFormatComponentProps>;

    Image: ComponentType<ImageComponentProps>;
    Text: ComponentType<TextComponentProps>;
    Link: ComponentType<LinkComponentProps>;
    Input: ComponentType<InputComponentProps>;
    Message: ComponentType<MessageComponentProps>;
    Button: ComponentType<ButtonComponentProps>;
    Checkbox: ComponentType<CheckboxComponentProps>;

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
        Image: ({ src }) => <img alt="hello" src={src} />,
        Text: ({ label }) => <span>{label}</span>,
        Link: ({ href, children }) => <a href="onet.pl">{children}</a>,
        Input: ({ id, ...props }) => <input id={id} {...props} />,
        Message: () => <span />,
        Button: ({ header, social, ...props }) => <button {...props}>{header}</button>,
        Checkbox: ({ label, ...props }) => (
            <div>
                <input {...props} />
                {label}
            </div>
        ),

        MessageFormat: ({ text }) => <span>{text}</span>,

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
    useHandleFlowError: null as any,
});

export function useKratosContext() {
    return useContext(kratosContext);
}

export type KratosContextProviderProps = {
    components?: Partial<KratosComponents>;
    useHandleFlowError: UseHandleFlowError;
    children?: ReactNode;
};

export function KratosContextProvider({ components = {}, useHandleFlowError, children }: KratosContextProviderProps) {
    const { components: baseComponents } = useKratosContext();

    const value = useMemo<KratosContextData>(
        () => ({
            components: {
                ...baseComponents,
                ...components,
            },
            useHandleFlowError,
        }),
        [baseComponents, components, useHandleFlowError],
    );

    return <kratosContext.Provider value={value}>{children}</kratosContext.Provider>;
}
