import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, SettingsFlow, UpdateSettingsFlowBody } from "@ory/kratos-client";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useLocation, useNavigate } from "react-router";
import { UseHandleFlowError } from "./types/useHandleFlowError";
import { returnToParameterName } from "./utils/variables";

type UseSettingsFlowFactoryProps = {
    useHandleFlowError: UseHandleFlowError;
};

export function settingsFlowHookFactory({ useHandleFlowError }: UseSettingsFlowFactoryProps) {
    return function useSettingsFlow({
        kratosClient,
        settingsRoute,
        params,
    }: {
        kratosClient: FrontendApi;
        settingsRoute: string;
        params?: AxiosRequestConfig["params"];
    }) {
        const [flow, setFlow] = useState<SettingsFlow>();

        const { search } = useLocation();
        const nav = useNavigate();

        const { flow: flowId, [returnToParameterName]: returnTo } = useMemo(
            () => Object.fromEntries([...new URLSearchParams(search).entries()]) as Partial<Record<string, string>>,
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

            if (flowId) {
                kratosClient
                    .getSettingsFlow({ id: flowId })
                    .then(({ data }) => setFlow(data))
                    .catch(handleFlowError);
                return;
            }

            kratosClient
                .createBrowserSettingsFlow(
                    {
                        returnTo,
                    },
                    {
                        params,
                    },
                )
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError);
        }, [flow, flowId, handleFlowError, kratosClient, params, returnTo, settingsRoute]);

        const submit = useCallback(
            (values: UpdateSettingsFlowBody) => {
                if (!flow) return;

                nav(`${settingsRoute}?flow=${flow.id}`, { replace: true });

                return kratosClient
                    .updateSettingsFlow({ flow: flow.id, updateSettingsFlowBody: values })
                    .then(({ data }) => {
                        if (flow.return_to) {
                            window.location.href = flow.return_to;
                            return;
                        }

                        setFlow(data);
                    })
                    .catch(handleFlowError)
                    .catch((err: AxiosError) => {
                        if (err.response?.status === 400) {
                            setFlow(err.response?.data);
                            return;
                        }

                        return Promise.reject(err);
                    });
            },
            [flow, handleFlowError, nav, kratosClient, settingsRoute],
        );

        return { flow, submit };
    };
}
