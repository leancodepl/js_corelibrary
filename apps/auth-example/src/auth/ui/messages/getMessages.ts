import { getMessagesFactory } from "@leancodepl/kratos";
import { uiMessageRenderer } from "./UiMessage";

export const getMessages = getMessagesFactory({ uiMessageRenderer });
