import { Button, Center, Stack } from "@chakra-ui/react";
import { aalParameterName } from "@leancodepl/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signInRoute } from "../../app/routes";
import { sessionManager } from "../../auth/sessionManager";
import { SignIn } from "../../components/auth/SignIn";
import { useIsSignedIn } from "../../hooks/useIsSignedIn";

export function SignInPage() {
    const isSignedIn = useIsSignedIn();

    const nav = useNavigate();
    const [search] = useSearchParams();

    const is2FAFlow = search.get(aalParameterName) === "aal2";

    return (
        <Center>
            {isSignedIn ? (
                "Already signed in"
            ) : (
                <Stack>
                    <SignIn />
                    {is2FAFlow && (
                        <Button
                            as={Link}
                            onClick={async () => {
                                await sessionManager.signOut();

                                nav(signInRoute, { replace: true });
                            }}>
                            Wróć do ekranu logowania
                        </Button>
                    )}
                </Stack>
            )}
        </Center>
    );
}
