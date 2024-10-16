import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Center, Flex, Spinner, Text } from "@chakra-ui/react"
import { RegistrationCard, useRegisterFlow } from "@leancodepl/kratos"
import { kratosClient } from "../../../auth/ory"
import { sessionManager } from "../../../auth/sessionManager"
import { parseSearchParams } from "../../../utils/parseSearchParams"

export function Register() {
    const [searchParams, updateSearchParams] = useSearchParams()

    const { flow, submit, isRegistered } = useRegisterFlow({
        kratosClient,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfLoggedIn()
        }, []),
        searchParams: useMemo(() => parseSearchParams(searchParams), [searchParams]),
        updateSearchParams,
    })

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
        )
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
    )
}
