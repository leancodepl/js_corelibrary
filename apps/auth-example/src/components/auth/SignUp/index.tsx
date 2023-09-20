import { useCallback } from "react";
import { Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { signUpRoute } from "../../../app/routes";
import { Flow, useSignUpFlow } from "../../../auth";
import { kratosClient } from "../../../auth/ory";
import sessionManager from "../../../auth/sessionManager";

export default function SignUp() {
    const { flow, submit, isSignedUp } = useSignUpFlow({
        kratosClient,
        signUpRoute,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfSignedIn();
        }, []),
    });

    if (isSignedUp) {
        return (
            <Center>
                <Flex direction="column" gap="4">
                    <Text as="b">Sprawdź swoją skrzynkę</Text>
                    <Text>
                        Na podany adres e-mail wysłaliśmy Ci wiadomość z linkiem do wpisania kodu aktywacyjnego. Kliknij
                        w link i wpisz kod, aby potwierdzić adres e-mail i aktywować konto.
                    </Text>
                </Flex>
            </Center>
        );
    }

    return (
        <Center>
            <Flex direction="column" gap="4">
                {flow ? (
                    <Flow except={traitsToSkip} flow={flow} nodesWrapper={Stack} onSubmit={submit} />
                ) : (
                    <Flex justify="center">
                        <Spinner size="xl" />
                    </Flex>
                )}
            </Flex>
        </Center>
    );
}

const traitsToSkip = ["traits.additional_emails"];
