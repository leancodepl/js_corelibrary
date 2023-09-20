import { useCallback, useMemo } from "react";
import { Spinner } from "@chakra-ui/react";
import { isUiNodeInputAttributes } from "@leancodepl/auth";
import { VerificationFlow } from "@ory/kratos-client";
import { useNavigate } from "react-router";
import { signInRoute } from "../../../app/routes";
import { Flow, useVerificationFlow } from "../../../auth";
import { kratosClient } from "../../../auth/ory";
import { CustomUiMessageParams } from "../../../auth/ui/messages/UiMessage";

export default function Verification() {
    const nav = useNavigate();

    const { flow, submit } = useVerificationFlow({
        kratosClient,
        onVerified: useCallback(() => {
            nav(signInRoute);
        }, [nav]),
    });

    const customUiMessage = useMemo(() => mkCustomUiMessage(flow), [flow]);

    if (!flow) return <Spinner />;

    return <Flow flow={flow} UiMessage={customUiMessage} onSubmit={submit} />;
}

function mkCustomUiMessage(flow?: VerificationFlow) {
    return ({ uiMessage, attributes, text: uiText }: CustomUiMessageParams) => {
        switch (uiText?.id) {
            case 1080003: // InfoSelfServiceVerificationEmailWithCodeSent
                if (
                    flow?.ui.nodes.some(
                        ({ attributes }) =>
                            isUiNodeInputAttributes(attributes) && attributes.name === "code" && attributes.value,
                    )
                ) {
                    return null;
                }
        }

        return uiMessage({ attributes, text: uiText });
    };
}
