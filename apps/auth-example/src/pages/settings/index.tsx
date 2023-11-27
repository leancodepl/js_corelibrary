import { Center, Flex, Text } from "@chakra-ui/react";
import { loginRoute } from "../../app/routes";
import { Settings } from "../../components/auth/Settings";
import { Redirect } from "../../components/common/Redirect";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

export function SettingsPage() {
    const isLoggedIn = useIsLoggedIn();

    if (!isLoggedIn) {
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
