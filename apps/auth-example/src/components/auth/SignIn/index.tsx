import { useCallback } from "react";
import { Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { CustomUiMessageParams, returnToParameterName } from "@leancodepl/auth";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { signInRoute } from "../../../app/routes";
import { Flow, useSignInFlow } from "../../../auth";
import { kratosClient } from "../../../auth/ory";
import sessionManager from "../../../auth/sessionManager";

export default function SignIn() {
    const handleSignIn = useHandleSignIn();

    const { flow, submit } = useSignInFlow({
        kratosClient,
        signInRoute,
        onSignedIn: handleSignIn,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfSignedIn();
        }, []),
    });

    return (
        <Flex direction="column" gap="4">
            <Text as="b">Sign In</Text>

            {flow ? (
                <Flow flow={flow} nodesWrapper={Stack} UiMessage={CustomUiMessage} onSubmit={submit} />
            ) : (
                <Center>
                    <Spinner size="xl" />
                </Center>
            )}
        </Flex>
    );
}

function CustomUiMessage({ uiMessage, attributes, text: uiText }: CustomUiMessageParams) {
    switch (uiText?.id) {
        case 1070004: // InfoNodeLabelID
            return "E-mail";
    }

    return uiMessage({ attributes, text: uiText });
}

function useHandleSignIn() {
    const nav = useNavigate();
    const [search] = useSearchParams();
    const returnTo = search.get(returnToParameterName);

    return useCallback(async () => {
        try {
            const session = (await kratosClient.toSession()).data;
            sessionManager.setSession(session);

            if (returnTo) {
                nav(returnTo);
                return;
            }
        } catch (err) {
            const data = (err as AxiosError).response?.data;
            switch (data.error.code) {
                case 403:
                    if (data.error?.id === "session_aal2_required") {
                        nav(`${signInRoute}?aal=aal2`, { replace: true });
                    }
                    break;
            }
        }
    }, [nav, returnTo]);
}
