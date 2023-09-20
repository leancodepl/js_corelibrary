import { Button, Card, CardBody, CardFooter, Center, Text } from "@chakra-ui/react";
import sessionManager from "../../auth/sessionManager";
import useIdentity from "../../hooks/useIdentity";

export default function HomePage() {
    const identity = useIdentity();

    const handleSignOut = () => {
        sessionManager.signOut();
    };

    return (
        <Center>
            <Card>
                {identity ? (
                    <>
                        <CardBody>
                            <pre>{JSON.stringify(identity, null, 2)}</pre>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={handleSignOut}>Sign Out</Button>
                        </CardFooter>
                    </>
                ) : (
                    <Text>Not signed in</Text>
                )}
            </Card>
        </Center>
    );
}
