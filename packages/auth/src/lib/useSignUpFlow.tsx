import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/kratos-client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { UseHandleFlowError } from "./types/useHandleFlowError";
import { returnToParameterName } from "./utils/variables";

type UseSignUpFlowFactoryProps = {
    useHandleFlowError: UseHandleFlowError;
};

export function signUpFlowHookFactory({ useHandleFlowError }: UseSignUpFlowFactoryProps) {
    return function useSignUpFlow({
        kratosClient,
        signUpRoute,
        onSessionAlreadyAvailable,
    }: {
        kratosClient: FrontendApi;
        signUpRoute: string;
        onSessionAlreadyAvailable: () => void;
    }) {
        const [flow, setFlow] = useState<RegistrationFlow>();
        const [isSignedUp, setIsSignedUp] = useState(false);

        const { search } = useLocation();
        const nav = useNavigate();

        const { flow: flowId, [returnToParameterName]: returnTo } = useMemo(
            () => Object.fromEntries([...new URLSearchParams(search).entries()]) as Partial<Record<string, string>>,
            [search],
        );

        const handleFlowError = useHandleFlowError({
            resetFlow: useCallback(() => {
                nav(signUpRoute, { replace: true });
                setFlow(undefined);
            }, [nav, signUpRoute]),
            onSessionAlreadyAvailable,
        });

        useEffect(() => {
            if (flow) return;

            if (flowId) {
                kratosClient
                    .getRegistrationFlow({ id: flowId })
                    .then(({ data }) => setFlow(data))
                    .catch(handleFlowError);
                return;
            }

            kratosClient
                .createBrowserRegistrationFlow({ returnTo })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError);
        }, [flowId, returnTo, flow, handleFlowError, kratosClient]);

        const submit = useCallback(
            (values: UpdateRegistrationFlowBody) => {
                if (!flow) return;

                nav(`${signUpRoute}?flow=${flow.id}`, { replace: true });

                return kratosClient
                    .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: values })
                    .then(() => setIsSignedUp(true))
                    .catch(handleFlowError)
                    .catch((err: AxiosError) => {
                        if (err.response?.status === 400) {
                            setFlow(err.response?.data);
                            return;
                        }

                        return Promise.reject(err);
                    });
            },
            [flow, handleFlowError, nav, kratosClient, signUpRoute],
        );

        return { flow, submit, isSignedUp };
    };
}
