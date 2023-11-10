import { useCallback } from "react";
import { Spinner } from "@chakra-ui/react";
import { VerificationCard, useVerificationFlow } from "@leancodepl/kratos";
import { useNavigate } from "react-router";
import { signInRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";

export function Verification() {
    const nav = useNavigate();

    const { flow, submit } = useVerificationFlow({
        kratosClient,
        onVerified: useCallback(() => {
            nav(signInRoute);
        }, [nav]),
    });

    if (!flow) return <Spinner />;

    return <VerificationCard flow={flow} onSubmit={submit} />;
}
