import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { returnToParameterName } from "../utils/variables";

export function useRecoveryFlow({
    kratosClient,
    recoveryRoute,
    settingsRoute,
    onSessionAlreadyAvailable,
}: {
    kratosClient: FrontendApi;
    recoveryRoute: string;
    settingsRoute: string;
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

            nav(`${recoveryRoute}?flow=${flow.id}`, { replace: true });

            return kratosClient
                .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
                .then(({ data }) => {
                    setFlow(data);

                    if (
                        data.continue_with &&
                        "flow" in data.continue_with[0] &&
                        data.continue_with[0].action === "show_settings_ui"
                    ) {
                        const url = new URL(window.location.origin + settingsRoute);
                        url.searchParams.set("flow", data.continue_with[0].flow.id);
                        window.open(url, "_self");
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
        [flow, nav, recoveryRoute, kratosClient, handleFlowError, settingsRoute],
    );

    return { flow, submit, isRecovering: flow?.state === "sent_email" };
}
