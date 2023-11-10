import { Flex, Spinner, Text } from "@chakra-ui/react";
import { LoginCard, useLoginFlow } from "@leancodepl/kratos";
import { useNavigate } from "react-router";
import { loginRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";

export function RefreshSession() {
    const nav = useNavigate();
    const { flow, submit } = useLoginFlow({
        kratosClient,
        loginRoute,
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

            {flow ? <LoginCard flow={flow} onSubmit={submit} /> : <Spinner />}
        </Flex>
    );
}
