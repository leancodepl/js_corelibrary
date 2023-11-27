import { Center, Stack } from "@chakra-ui/react";
import { Login } from "../../components/auth/Login";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

export function LoginPage() {
    const isLoggedIn = useIsLoggedIn();

    return (
        <Center>
            {isLoggedIn ? (
                "Already signed in"
            ) : (
                <Stack>
                    <Login />
                </Stack>
            )}
        </Center>
    );
}
