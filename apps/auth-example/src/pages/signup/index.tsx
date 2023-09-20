import { Center } from "@chakra-ui/react";
import SignUp from "../../components/auth/SignUp";
import useIsSignedIn from "../../hooks/useIsSignedIn";

export default function SignUpPage() {
    const isSignedIn = useIsSignedIn();

    return <Center>{isSignedIn ? "Already signed in" : <SignUp />}</Center>;
}
