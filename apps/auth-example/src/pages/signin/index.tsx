import { Center, Stack } from "@chakra-ui/react";
import { SignIn } from "../../components/auth/SignIn";
import { useIsSignedIn } from "../../hooks/useIsSignedIn";

export function SignInPage() {
    const isSignedIn = useIsSignedIn();

    return (
        <Center>
            {isSignedIn ? (
                "Already signed in"
            ) : (
                <Stack>
                    <SignIn />
                </Stack>
            )}
        </Center>
    );
}
