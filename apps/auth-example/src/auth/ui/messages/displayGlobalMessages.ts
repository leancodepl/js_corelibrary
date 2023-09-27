import { CustomUiMessage } from "@leancodepl/kratos";
import { UiText } from "@ory/kratos-client";
import { toast } from "react-toastify";
import { getMessages } from "./getMessages";

export function displayGlobalMessages(messages: UiText[], customUiMessage?: CustomUiMessage) {
    const { error, info, success } = getMessages({ messages, attributes: undefined, customUiMessage });

    if (error) toast.error(error);
    if (info) toast.info(info);
    if (success) toast.success(success);
}
