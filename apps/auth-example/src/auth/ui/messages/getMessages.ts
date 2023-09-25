import { getMessagesFactory } from "@leancodepl/auth";
import { uiMessageRenderer } from "./UiMessage";

export const getMessages = getMessagesFactory({ uiMessageRenderer });
