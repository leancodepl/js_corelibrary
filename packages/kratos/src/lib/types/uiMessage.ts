import { ComponentType, ReactNode } from "react";
import { UiNodeInputAttributes, UiNodeTextAttributes, UiText } from "@ory/kratos-client";

export type UiMessageProps = {
    text?: UiText;
    attributes?: UiNodeInputAttributes | UiNodeTextAttributes;
};

export type UiMessageRenderer = (
    props: UiMessageProps & {
        customUiMessage?: CustomUiMessage;
    },
) => ReactNode;

type UiMessageContent = (props: UiMessageProps) => ReactNode;

export type CustomUiMessageParams = {
    text?: UiText;
    attributes?: UiNodeInputAttributes | UiNodeTextAttributes;
    uiMessage: UiMessageContent;
};

export type CustomUiMessage = (params: CustomUiMessageParams) => ReactNode;

type CustomGetMessageProviderProps = {
    uiMessage?: CustomUiMessage;
    children?: ReactNode;
};

export type CustomGetMessageProvider = ComponentType<CustomGetMessageProviderProps>;
