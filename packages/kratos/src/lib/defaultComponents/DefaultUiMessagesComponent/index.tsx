import { NodeMessages } from "../../helpers/errorMessages";
import type { UiMessagesComponentProps } from "../../kratosContext";

export function DefaultUiMessagesComponent(props: UiMessagesComponentProps) {
    return <NodeMessages {...props} />;
}
