import { useCallback } from "react";
import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { RegistrationCard, useRegisterFlow } from "@leancodepl/kratos";
import { registerRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";
import { sessionManager } from "../../../auth/sessionManager";

export function Register() {
    const { flow, submit, isRegistered } = useRegisterFlow({
        kratosClient,
        registrationRoute: registerRoute,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfLoggedIn();
        }, []),
    });

    if (isRegistered) {
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
                    <RegistrationCard flow={flow} onSubmit={submit} />
                ) : (
                    <Flex justify="center">
                        <Spinner size="xl" />
                    </Flex>
                )}
            </Flex>
        </Center>
    );
}
