import { mkAuth } from "@leancodepl/auth";
import { displayGlobalMessages } from "./ui/messages/displayGlobalMessages";
import { CustomGetMessageProvider } from "./ui/messages/UiMessage";
import { NodeImage } from "./ui/node/image";
import { NodeInput } from "./ui/node/input";
import { NodeText } from "./ui/node/text";
import { useHandleFlowError } from "./useHandleFlowError";

export const { Flow, useSignInFlow, useSignUpFlow, useVerificationFlow } = mkAuth({
    useHandleFlowError,
    displayGlobalMessages,
    customGetMessageProvider: CustomGetMessageProvider,
    nodeComponents: {
        NodeImage,
        NodeInput,
        NodeText,
    },
});
