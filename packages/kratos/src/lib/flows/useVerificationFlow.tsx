import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { flowIdParameterName, returnToParameterName } from "../utils/variables";

export function useVerificationFlow({
    initialFlowId,
    kratosClient,
    onVerified,
}: {
    initialFlowId?: string;
    kratosClient: FrontendApi;
    onVerified: () => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<VerificationFlow>();

    const { search } = useLocation();
    const nav = useNavigate();

    const { [flowIdParameterName]: flowId = initialFlowId, [returnToParameterName]: returnTo } = useMemo(
        () => parseSearchParams(search),
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

        const controller = new AbortController();

        if (flowId) {
            kratosClient
                .getVerificationFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        } else {
            kratosClient
                .createBrowserVerificationFlow({ returnTo }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        }

        return () => {
            controller.abort();
        };
    }, [flowId, returnTo, flow, handleFlowError, kratosClient, nav, onVerified]);

    const submit = useCallback(
        ({ body }: { body: UpdateVerificationFlowBody }) => {
            if (!flow) return;

            const params = new URLSearchParams(search);
            params.set(flowIdParameterName, flow.id);

            nav({ search: params.toString() }, { replace: true });

            return kratosClient
                .updateVerificationFlow({ flow: flow.id, updateVerificationFlowBody: body })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError)
                .catch((err: AxiosError<VerificationFlow>) => {
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
}
