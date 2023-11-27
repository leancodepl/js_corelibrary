import { Center } from "@chakra-ui/react";
import { Register } from "../../components/auth/Register";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

export function RegisterPage() {
    const isLoggedIn = useIsLoggedIn();

    return <Center>{isLoggedIn ? "Already signed in" : <Register />}</Center>;
}
