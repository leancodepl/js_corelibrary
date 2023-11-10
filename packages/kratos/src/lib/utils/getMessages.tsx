/* eslint-disable react/jsx-no-useless-fragment */
import { ComponentType, ReactNode } from "react";
import { UiNodeInputAttributes, UiText } from "@ory/client";
import _ from "lodash";
import { CustomUiMessage, UiMessageProps } from "../types/uiMessage";

type UiMessageRendererProps = UiMessageProps & { customUiMessage?: CustomUiMessage };

export function getMessagesFactory({
    textWrapper: TextWrapper = PWrapper,
    uiMessageRenderer,
}: {
    textWrapper?: ComponentType<{ children: ReactNode }>;
    uiMessageRenderer: (props: UiMessageRendererProps) => ReactNode;
}) {
    return function getMessages({
        messages,
        attributes,
        customUiMessage,
        maxMessagesPerGroup,
    }: {
        messages: UiText[];
        attributes?: UiNodeInputAttributes;
        customUiMessage?: CustomUiMessage;
        maxMessagesPerGroup?: number;
    }): Partial<Record<"error" | "info" | "success", ReactNode>> {
        return _(messages)
            .uniqBy(({ id }) => id)
            .groupBy(({ type }) => type)
            .mapValues(e => e.map(text => uiMessageRenderer({ text, attributes, customUiMessage })).filter(Boolean))
            .omitBy(v => v.length === 0)
            .mapValues(
                e =>
                    (e?.length ?? 0) > 0 && (
                        <>
                            {e?.slice(0, maxMessagesPerGroup)?.map((v, i) => (
                                <TextWrapper key={i}>{v}</TextWrapper>
                            ))}
                        </>
                    ),
            )
            .value();
    };
}
const PWrapper = ({ children }: { children: ReactNode }) => <p>{children}</p>;
