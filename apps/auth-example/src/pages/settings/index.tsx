import { Center, Flex, Text } from "@chakra-ui/react";
import { Settings } from "../../components/auth/Settings";

export function PasswordChangePage() {
    return (
        <Center>
            <Flex direction="column" justify="center">
                <Text as="b">Zmień hasło</Text>

                <Settings />
            </Flex>
        </Center>
    );
}
