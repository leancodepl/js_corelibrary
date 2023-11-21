import { Center, Flex, Text } from "@chakra-ui/react";
import { loginRoute } from "../../app/routes";
import { Settings } from "../../components/auth/Settings";
import { Redirect } from "../../components/common/Redirect";
import { useIsSignedIn } from "../../hooks/useIsSignedIn";

export function SettingsPage() {
    const isSignedIn = useIsSignedIn();

    if (!isSignedIn) {
        <Redirect path={loginRoute} />;
    }

    return (
        <Center>
            <Flex direction="column" justify="center">
                <Text as="b">Ustawienia</Text>

                <Settings />
            </Flex>
        </Center>
    );
}
