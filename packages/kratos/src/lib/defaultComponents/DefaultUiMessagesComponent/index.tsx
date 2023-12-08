import { NodeMessages } from "../../helpers/errorMessages";
import type { UiMessagesComponentProps } from "../../types/components";

export function DefaultUiMessagesComponent(props: UiMessagesComponentProps) {
    return <NodeMessages {...props} />;
}
