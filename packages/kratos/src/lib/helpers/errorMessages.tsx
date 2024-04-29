import { UiNode, UiText } from "@ory/client";
import { useKratosContext } from "../kratosContext";
import { FormattedMessage } from "./formattedMessage";
import type { MessageComponentProps } from "../types/components";

type NodeMessagesProps = {
    nodes?: UiNode[];
    uiMessages?: UiText[];
};

type NodeMessageProps = Omit<MessageComponentProps, "severity">;

function NodeMessage({ message, ...props }: NodeMessageProps) {
    const {
        components: { Message },
    } = useKratosContext();

    return (
        <Message message={message} severity={message.type} {...props}>
            <FormattedMessage message={message} />
        </Message>
    );
}

export function NodeMessages({ nodes, uiMessages }: NodeMessagesProps) {
    const $groupMessages =
        nodes?.reduce<JSX.Element[]>((groups, { messages }) => {
            groups.push(
                ...messages
                    .map((message, key) => (
                        <NodeMessage key={`node-group-message-${message.id}-${key}`} message={message} />
                    ))
                    .filter(Boolean),
            );
            return groups;
        }, []) ?? [];

    const $messages =
        uiMessages?.map((message, key) => <NodeMessage key={`ui-message-${message.id}-${key}`} message={message} />) ??
        [];

    const $allMessages = [...$groupMessages, ...$messages];

    if ($allMessages.length <= 0) return null;

    return <div>{$allMessages}</div>;
}
