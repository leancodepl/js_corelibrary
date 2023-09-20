/* eslint-disable react/jsx-no-useless-fragment */
import { ReactNode } from "react";
import styled from "@emotion/styled";
import { UiNodeInputAttributes, UiText } from "@ory/kratos-client";
import _ from "lodash";
import { CustomUiMessage, uiMessageRenderer } from "./UiMessage";

export function getMessages({
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
                            <PWrapper key={i}>{v}</PWrapper>
                        ))}
                    </>
                ),
        )
        .value();
}

const PWrapper = styled.p`
    margin: 0;
`;
