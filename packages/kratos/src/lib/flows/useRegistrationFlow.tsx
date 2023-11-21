import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { returnToParameterName } from "../utils/variables";

export function useRegisterFlow({
    kratosClient,
    registrationRoute,
    onSessionAlreadyAvailable,
}: {
    kratosClient: FrontendApi;
    registrationRoute: string;
    onSessionAlreadyAvailable: () => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<RegistrationFlow>();
    const [isRegistered, setIsRegistered] = useState(false);

    const { search } = useLocation();
    const nav = useNavigate();

    const { flow: flowId, [returnToParameterName]: returnTo } = useMemo(() => parseSearchParams(search), [search]);

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            nav(registrationRoute, { replace: true });
            setFlow(undefined);
        }, [nav, registrationRoute]),
        onSessionAlreadyAvailable,
    });

    useEffect(() => {
        if (flow) return;

        const controller = new AbortController();

        if (flowId) {
            kratosClient
                .getRegistrationFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        } else {
            kratosClient
                .createBrowserRegistrationFlow({ returnTo }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        }

        return () => {
            controller.abort();
        };
    }, [flowId, returnTo, flow, handleFlowError, kratosClient]);

    const submit = useCallback(
        ({ body }: { body: UpdateRegistrationFlowBody }) => {
            if (!flow) return;

            nav(`${registrationRoute}?flow=${flow.id}`, { replace: true });

            return kratosClient
                .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: body })
                .then(() => setIsRegistered(true))
                .catch(handleFlowError)
                .catch((err: AxiosError<RegistrationFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data);
                        return;
                    }

                    return Promise.reject(err);
                });
        },
        [flow, handleFlowError, nav, kratosClient, registrationRoute],
    );

    return { flow, submit, isRegistered };
}
