import { useCallback, useEffect, useMemo, useState } from "react";
import { ContinueWith, FrontendApi, RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { flowIdParameterName, returnToParameterName } from "../utils/variables";

export function useRecoveryFlow({
    kratosClient,
    recoveryRoute,
    onSessionAlreadyAvailable,
    onContinueWith,
}: {
    kratosClient: FrontendApi;
    recoveryRoute: string;
    onSessionAlreadyAvailable: () => void;
    onContinueWith?: (continueWith: ContinueWith[]) => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<RecoveryFlow>();

    const { search } = useLocation();
    const nav = useNavigate();

    const { [flowIdParameterName]: flowId, [returnToParameterName]: returnTo } = useMemo(
        () => parseSearchParams(search),
        [search],
    );

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            nav(recoveryRoute, { replace: true });
            setFlow(undefined);
        }, [nav, recoveryRoute]),
        onSessionAlreadyAvailable,
    });

    useEffect(() => {
        if (flow) return;

        const controller = new AbortController();

        if (flowId) {
            kratosClient
                .getRecoveryFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
            return;
        } else {
            kratosClient
                .createBrowserRecoveryFlow({ returnTo }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        }

        return () => {
            controller.abort();
        };
    }, [flowId, returnTo, flow, handleFlowError, kratosClient, nav]);

    const submit = useCallback(
        ({ body }: { body: UpdateRecoveryFlowBody }) => {
            if (!flow) return;

            nav(`${recoveryRoute}?${flowIdParameterName}=${flow.id}`, { replace: true });

            return kratosClient
                .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
                .then(({ data }) => {
                    setFlow(data);

                    if (data.continue_with) {
                        onContinueWith?.(data.continue_with);
                    }
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<RecoveryFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data);
                        return;
                    }

                    return Promise.reject(err);
                });
        },
        [flow, nav, recoveryRoute, kratosClient, handleFlowError, onContinueWith],
    );

    return { flow, submit, isRecovering: flow?.state === "sent_email" };
}
