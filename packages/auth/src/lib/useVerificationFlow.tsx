import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, UpdateVerificationFlowBody, VerificationFlow } from "@ory/kratos-client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { UseHandleFlowError } from "./types/useHandleFlowError";
import { returnToParameterName } from "./utils/variables";

type UseVerificationFlowFactoryProps = {
    useHandleFlowError: UseHandleFlowError;
};

export function verificationFlowHookFactory({ useHandleFlowError }: UseVerificationFlowFactoryProps) {
    return function useVerificationFlow({
        initialFlowId,
        kratosClient,
        onVerified,
    }: {
        initialFlowId?: string;
        kratosClient: FrontendApi;
        onVerified: () => void;
    }) {
        const [flow, setFlow] = useState<VerificationFlow>();

        const { search } = useLocation();
        const nav = useNavigate();

        const { [flowIdParameterName]: flowId = initialFlowId, [returnToParameterName]: returnTo } = useMemo(
            () => Object.fromEntries([...new URLSearchParams(search).entries()]) as Partial<Record<string, string>>,
            [search],
        );

        const resetFlow = useCallback(
            (flowId?: string) => {
                const params = new URLSearchParams(search);
                if (flowId) {
                    params.set(flowIdParameterName, flowId);
                } else {
                    params.delete(flowIdParameterName);
                }

                nav({ search: params.toString() }, { replace: true });

                setFlow(undefined);
            },
            [nav, search],
        );

        const reset = () => {
            resetFlow();
        };

        const handleFlowError = useHandleFlowError({
            resetFlow,
        });

        useEffect(() => {
            flow?.state === "passed_challenge" && onVerified();
        }, [flow?.state, onVerified]);

        useEffect(() => {
            if (flow) return;

            if (flowId) {
                kratosClient
                    .getVerificationFlow({ id: flowId })
                    .then(({ data }) => setFlow(data))
                    .catch(handleFlowError);
                return;
            }

            kratosClient
                .createBrowserVerificationFlow({ returnTo })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError);
        }, [flowId, returnTo, flow, handleFlowError, kratosClient, nav, onVerified]);

        const submit = useCallback(
            (values: UpdateVerificationFlowBody) => {
                if (!flow) return;

                const params = new URLSearchParams(search);
                params.set(flowIdParameterName, flow.id);

                nav({ search: params.toString() }, { replace: true });

                return kratosClient
                    .updateVerificationFlow({ flow: flow.id, updateVerificationFlowBody: values })
                    .then(({ data }) => setFlow(data))
                    .catch(handleFlowError)
                    .catch((err: AxiosError) => {
                        if (err.response?.status === 400) {
                            setFlow(err.response?.data);
                            return;
                        }

                        return Promise.reject(err);
                    });
            },
            [flow, search, nav, kratosClient, handleFlowError],
        );

        return { flow, submit, reset };
    };
}

const flowIdParameterName = "flow";
