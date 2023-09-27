import { UiText } from "@ory/kratos-client";
import { flowFactory } from "./flowFactory";
import { NodeFactoryProps } from "./node";
import { CustomGetMessageProvider, CustomUiMessage } from "./types/uiMessage";
import { UseHandleFlowError } from "./types/useHandleFlowError";
import { reauthenticationFlowHookFactory } from "./useReauthenticationFlow";
import { recoveryFlowHookFactory } from "./useRecoveryFlow";
import { settingsFlowHookFactory } from "./useSettingsFlow";
import { signInFlowHookFactory } from "./useSignInFlow";
import { signUpFlowHookFactory } from "./useSignUpFlow";
import { verificationFlowHookFactory } from "./useVerificationFlow";

export type MkAuthProps = {
    useHandleFlowError: UseHandleFlowError;
    displayGlobalMessages: (messages: UiText[], customUiMessage?: CustomUiMessage) => void;
    customGetMessageProvider: CustomGetMessageProvider;
} & NodeFactoryProps;

export const mkAuth = ({
    useHandleFlowError,
    displayGlobalMessages,
    nodeComponents,
    customGetMessageProvider,
}: MkAuthProps) => {
    const Flow = flowFactory({ displayGlobalMessages, nodeComponents, customGetMessageProvider });

    const useReuthenticateFlow = reauthenticationFlowHookFactory({ useHandleFlowError });
    const useRecoveryFlow = recoveryFlowHookFactory({ useHandleFlowError });
    const useSettingsFlow = settingsFlowHookFactory({ useHandleFlowError });
    const useSignInFlow = signInFlowHookFactory({ useHandleFlowError });
    const useSignUpFlow = signUpFlowHookFactory({ useHandleFlowError });
    const useVerificationFlow = verificationFlowHookFactory({ useHandleFlowError });

    return {
        Flow,

        useReuthenticateFlow,
        useRecoveryFlow,
        useSettingsFlow,
        useSignInFlow,
        useSignUpFlow,
        useVerificationFlow,
    };
};
