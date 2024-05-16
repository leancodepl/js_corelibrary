import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"
import { Center, Flex, Spinner, Text, useToast } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { AuthenticatorAssuranceLevel, UiTextTypeEnum } from "@ory/client"
import {
    ErrorId,
    KratosContextProvider,
    LoginCard,
    ResponseError,
    UiMessagesComponentProps,
    aalParameterName,
    returnToParameterName,
    useLoginFlow,
} from "@leancodepl/kratos"
import { loginRoute } from "../../../app/routes"
import { kratosClient } from "../../../auth/ory"
import { sessionManager } from "../../../auth/sessionManager"

export function Login() {
    const handleLogin = useHandleLogin()

    const { flow, submit } = useLoginFlow({
        kratosClient,
        loginRoute,
        onLoggedIn: handleLogin,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfLoggedIn()
        }, []),
    })

    return (
        <Flex direction="column" gap="4">
            <Text as="b">Sign In</Text>
            <KratosContextProvider components={{ UiMessages, OidcSectionWrapper }}>
                {flow ? (
                    <StyledLoginCard flow={flow} onSubmit={submit} />
                ) : (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                )}
            </KratosContextProvider>
        </Flex>
    )
}

function UiMessages({ uiMessages }: UiMessagesComponentProps) {
    const toast = useToast()

    useEffect(() => {
        uiMessages?.forEach(({ type, text }) =>
            toast({
                title: text,
                status: type === UiTextTypeEnum.Success ? "success" : type === UiTextTypeEnum.Error ? "error" : "info",
            }),
        )
    }, [toast, uiMessages])

    return null
}

function useHandleLogin() {
    const nav = useNavigate()
    const [search] = useSearchParams()
    const returnTo = search.get(returnToParameterName)

    return useCallback(async () => {
        try {
            const session = (await kratosClient.toSession()).data
            sessionManager.setSession(session)

            if (returnTo) {
                nav(returnTo)
                return
            }
        } catch (err) {
            const data = (err as ResponseError).response?.data

            switch (data.error.code) {
                case 403:
                case 422:
                    if (data.error?.id === ErrorId.ErrIDHigherAALRequired) {
                        nav(
                            `${loginRoute}?${new URLSearchParams({
                                [aalParameterName]: AuthenticatorAssuranceLevel.Aal2,
                            })}`,
                            {
                                replace: true,
                            },
                        )
                    }
                    break
            }
        }
    }, [nav, returnTo])
}

const OidcSectionWrapper = styled.div`
    display: flex;
    gap: 8px;
`

const StyledLoginCard = styled(LoginCard)`
    display: flex;
    flex-direction: column;
    gap: 16px;
`
