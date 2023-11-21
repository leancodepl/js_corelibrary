import { NodeMessages } from "../../helpers/errorMessages";
import { UiMessagesComponentProps } from "../../kratosContext";

export function DefaultUiMessagesComponent(props: UiMessagesComponentProps) {
    return <NodeMessages {...props} />;
}
