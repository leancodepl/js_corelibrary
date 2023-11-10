import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { useKratosContext } from "../kratosContext";
import { parseSearchParams } from "../utils/parseSearchParams";
import { returnToParameterName } from "../utils/variables";

export function useRecoveryFlow({
    kratosClient,
    recoveryRoute,
    onSessionAlreadyAvailable,
}: {
    kratosClient: FrontendApi;
    recoveryRoute: string;
    onSessionAlreadyAvailable: () => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<RecoveryFlow>();

    const { search } = useLocation();
    const nav = useNavigate();

    const { flow: flowId, [returnToParameterName]: returnTo } = useMemo(() => parseSearchParams(search), [search]);

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            nav(recoveryRoute, { replace: true });
            setFlow(undefined);
        }, [nav, recoveryRoute]),
        onSessionAlreadyAvailable,
    });

    useEffect(() => {
        if (flow) return;

        if (flowId) {
            kratosClient
                .getRecoveryFlow({ id: flowId })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError);
            return;
        }

        kratosClient
            .createBrowserRecoveryFlow({ returnTo })
            .then(({ data }) => setFlow(data))
            .catch(handleFlowError);
    }, [flowId, returnTo, flow, handleFlowError, kratosClient, nav]);

    const submit = useCallback(
        (values: UpdateRecoveryFlowBody) => {
            if (!flow) return;

            nav(`${recoveryRoute}?flow=${flow.id}`, { replace: true });

            return kratosClient
                .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: values })
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
        [flow, handleFlowError, nav, kratosClient, recoveryRoute],
    );

    return { flow, submit, isRecovering: flow?.state === "sent_email" };
}
