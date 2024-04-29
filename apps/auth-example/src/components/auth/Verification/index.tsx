import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@chakra-ui/react";
import { VerificationCard, useVerificationFlow } from "@leancodepl/kratos";
import { loginRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";

export function Verification() {
    const nav = useNavigate();

    const { flow, submit } = useVerificationFlow({
        kratosClient,
        onVerified: useCallback(() => {
            nav(loginRoute);
        }, [nav]),
    });

    if (!flow) return <Spinner />;

    return <VerificationCard flow={flow} onSubmit={submit} />;
}
