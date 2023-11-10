import { Button, Card, CardBody, CardFooter, Center, Text } from "@chakra-ui/react";
import { useLogoutFlow } from "@leancodepl/kratos";
import { kratosClient } from "../../auth/ory";
import { sessionManager } from "../../auth/sessionManager";
import { useIdentity } from "../../hooks/useIdentity";

export function HomePage() {
    const identity = useIdentity();

    const { logout } = useLogoutFlow({ kratosClient, onLoggedOut: () => sessionManager.checkIfLoggedIn() });

    return (
        <Center>
            <Card>
                {identity ? (
                    <>
                        <CardBody>
                            <pre>{JSON.stringify(identity, null, 2)}</pre>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={logout}>Sign Out</Button>
                        </CardFooter>
                    </>
                ) : (
                    <Text>Not signed in</Text>
                )}
            </Card>
        </Center>
    );
}
