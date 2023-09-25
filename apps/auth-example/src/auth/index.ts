import { mkAuth } from "@leancodepl/auth";
import { displayGlobalMessages } from "./ui/messages/displayGlobalMessages";
import { CustomGetMessageProvider } from "./ui/messages/UiMessage";
import { NodeImage } from "./ui/node/image";
import { NodeInputCheckbox } from "./ui/node/input/nodeInputCheckbox";
import { NodeInputDefault } from "./ui/node/input/nodeInputDefault";
import { NodeInputHidden } from "./ui/node/input/nodeInputHidden";
import { NodeInputPassword } from "./ui/node/input/nodeInputPassword";
import { NodeInputSubmit } from "./ui/node/input/nodeInputSubmit";
import { NodeText } from "./ui/node/text";
import { useHandleFlowError } from "./useHandleFlowError";

export const { Flow, useSignInFlow, useSignUpFlow, useVerificationFlow } = mkAuth({
    useHandleFlowError,
    displayGlobalMessages,
    customGetMessageProvider: CustomGetMessageProvider,
    nodeComponents: {
        NodeImage,
        NodeText,
        nodeInputs: {
            NodeInputCheckbox,
            NodeInputSubmit,
            NodeInputPassword,
            NodeInputDefault,
        },
    },
});
