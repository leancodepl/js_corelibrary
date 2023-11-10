import { useCallback } from "react";
import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { LoginCard, returnToParameterName, useLoginFlow } from "@leancodepl/kratos";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { signInRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";
import { sessionManager } from "../../../auth/sessionManager";

export function SignIn() {
    const handleSignIn = useHandleSignIn();

    const { flow, submit } = useLoginFlow({
        kratosClient,
        loginRoute: signInRoute,
        onLoggedIn: handleSignIn,
        onSessionAlreadyAvailable: useCallback(() => {
            sessionManager.checkIfLoggedIn();
        }, []),
        returnTo: "https://local.lncd.pl/signin",
    });

    return (
        <Flex direction="column" gap="4">
            <Text as="b">Sign In</Text>

            {flow ? (
                <StyledLoginCard flow={flow} OidcSectionWrapper={OidcSectionWrapper} onSubmit={submit} />
            ) : (
                <Center>
                    <Spinner size="xl" />
                </Center>
            )}
        </Flex>
    );
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
            // const data = (err as ResponseError).response?.data;
            // switch (data.error.code) {
            //     case 403:
            //         if (data.error?.id === "session_aal2_required") {
            //             nav(`${signInRoute}?${aalParameterName}=aal2`, { replace: true });
            //         }
            //         break;
            // }
        }
    }, [nav, returnTo]);
}

const OidcSectionWrapper = styled.div`
    display: flex;
    gap: 8px;
`;

const StyledLoginCard = styled(LoginCard)`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
