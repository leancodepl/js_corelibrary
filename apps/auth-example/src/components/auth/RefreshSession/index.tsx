import { Flex, Spinner, Text } from "@chakra-ui/react";
import { CustomUiMessageParams, ErrorValidation, InfoSelfServiceLogin } from "@leancodepl/auth";
import { useNavigate } from "react-router";
import { loginRoute } from "../../../app/routes";
import { Flow, useSignInFlow } from "../../../auth";
import { kratosClient } from "../../../auth/ory";

export function RefreshSession() {
    const nav = useNavigate();
    const { flow, submit } = useSignInFlow({
        kratosClient,
        signInRoute: loginRoute,
        onSessionAlreadyAvailable: () => {
            nav("/");
        },
    });

    return (
        <Flex direction="column" gap="large">
            <Flex direction="column" gap="small">
                <Text as="b">Potwierdź swoją tożsamość</Text>
                <Text as="b">Aby wykonać akcję, wpisz swoje hasło</Text>
            </Flex>
            {flow ? <Flow flow={flow} UiMessage={CustomUiMessage} onSubmit={submit} /> : <Spinner />}
        </Flex>
    );
}

function CustomUiMessage({ uiMessage, attributes, text: uiText }: CustomUiMessageParams) {
    switch (uiText?.id) {
        case InfoSelfServiceLogin.InfoSelfServiceLogin:
            return "Potwierdź";
        case ErrorValidation.ErrorValidationInvalidCredentials:
            return "Nieprawidłowe hasło";
    }

    return uiMessage({ attributes, text: uiText });
}
