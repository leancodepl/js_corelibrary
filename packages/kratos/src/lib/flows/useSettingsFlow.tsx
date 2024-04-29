import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ContinueWith, FrontendApi, SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { flowIdParameterName, returnToParameterName } from "../utils/variables";

export function useSettingsFlow({
    kratosClient,
    settingsRoute,
    params,
    onContinueWith,
}: {
    kratosClient: FrontendApi;
    settingsRoute: string;
    params?: AxiosRequestConfig["params"];
    onContinueWith?: (continueWith: ContinueWith[]) => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<SettingsFlow>();

    const { search } = useLocation();
    const nav = useNavigate();

    const { [flowIdParameterName]: flowId, [returnToParameterName]: returnTo } = useMemo(
        () => parseSearchParams(search),
        [search],
    );

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            nav(settingsRoute, { replace: true });
            setFlow(undefined);
        }, [nav, settingsRoute]),
    });

    useEffect(() => {
        if (flow) return;

        const controller = new AbortController();

        if (flowId) {
            kratosClient
                .getSettingsFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        } else {
            kratosClient
                .createBrowserSettingsFlow(
                    {
                        returnTo,
                    },
                    {
                        params,
                        signal: controller.signal,
                    },
                )
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        }

        return () => {
            controller.abort();
        };
    }, [flow, flowId, handleFlowError, kratosClient, params, returnTo, settingsRoute]);

    const submit = useCallback(
        ({ body }: { body: UpdateSettingsFlowBody }) => {
            if (!flow) return;

            nav(`${settingsRoute}?${flowIdParameterName}=${flow.id}`, { replace: true });

            return kratosClient
                .updateSettingsFlow({ flow: flow.id, updateSettingsFlowBody: body })
                .then(({ data }) => {
                    if (flow.return_to) {
                        window.location.href = flow.return_to;
                        return;
                    }

                    setFlow(data);

                    if (data.continue_with) {
                        onContinueWith?.(data.continue_with);
                    }
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<SettingsFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data);
                        return;
                    }

                    return Promise.reject(err);
                });
        },
        [flow, nav, settingsRoute, kratosClient, handleFlowError, onContinueWith],
    );

    return { flow, submit };
}
