import { Center } from "@chakra-ui/react";
import SignIn from "../../components/auth/SignIn";
import useIsSignedIn from "../../hooks/useIsSignedIn";

export default function SignInPage() {
    const isSignedIn = useIsSignedIn();

    return <Center>{isSignedIn ? "Already signed in" : <SignIn />}</Center>;
}
