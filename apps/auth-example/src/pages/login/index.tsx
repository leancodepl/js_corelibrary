import { Center, Stack } from "@chakra-ui/react";
import { Login } from "../../components/auth/Login";
import { useIsSignedIn } from "../../hooks/useIsSignedIn";

export function LoginPage() {
    const isSignedIn = useIsSignedIn();

    return (
        <Center>
            {isSignedIn ? (
                "Already signed in"
            ) : (
                <Stack>
                    <Login />
                </Stack>
            )}
        </Center>
    );
}
