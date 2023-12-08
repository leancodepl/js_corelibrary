import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { omit } from "lodash";
import { useLocation, useNavigate } from "react-router";
import yn from "yn";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";
import { parseSearchParams } from "../utils/parseSearchParams";
import { aalParameterName, flowIdParameterName, returnToParameterName } from "../utils/variables";

export function useLoginFlow({
    kratosClient,
    loginRoute,
    returnTo,
    onLoggedIn,
    onSessionAlreadyAvailable,
}: {
    kratosClient: FrontendApi;
    loginRoute: string;
    returnTo?: string;
    onLoggedIn?: (session: Session) => void;
    onSessionAlreadyAvailable?: () => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<LoginFlow>();

    const { search } = useLocation();
    const nav = useNavigate();

    const searchParams = useMemo(() => parseSearchParams(search), [search]);

    const {
        [flowIdParameterName]: flowId,
        [returnToParameterName]: returnToFromSearch,
        refresh,
        [aalParameterName]: authorizationAssuranceLevel,
    } = searchParams as Partial<Record<string, string>>;

    useEffect(() => {
        setFlow(undefined);
    }, [authorizationAssuranceLevel]);

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            const newParams = omit({ ...searchParams }, [flowIdParameterName, aalParameterName]);

            nav(`${loginRoute}?${new URLSearchParams(newParams)}`, { replace: true });

            setFlow(undefined);
        }, [nav, searchParams, loginRoute]),
        onSessionAlreadyAvailable,
    });

    useEffect(() => {
        if (flow) return;

        const controller = new AbortController();

        if (flowId) {
            kratosClient
                .getLoginFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        } else {
            kratosClient
                .createBrowserLoginFlow(
                    {
                        aal: authorizationAssuranceLevel,
                        refresh: yn(refresh),
                        returnTo: returnTo ?? returnToFromSearch,
                    },
                    { signal: controller.signal },
                )
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError);
        }

        return () => {
            controller.abort();
        };
    }, [
        authorizationAssuranceLevel,
        flow,
        flowId,
        handleFlowError,
        kratosClient,
        refresh,
        returnTo,
        returnToFromSearch,
    ]);

    const submit = useCallback(
        ({ body }: { body: UpdateLoginFlowBody }) => {
            if (!flow) return;

            nav(`${loginRoute}?${new URLSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })}`, {
                replace: true,
            });

            kratosClient
                .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: body })
                .then(({ data }) => {
                    if (flow.return_to) {
                        window.location.href = flow.return_to;
                        return;
                    }

                    onLoggedIn?.(data.session);
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<LoginFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err?.response?.data);
                        return;
                    }

                    return Promise.reject(err);
                });
        },
        [flow, nav, loginRoute, searchParams, kratosClient, handleFlowError, onLoggedIn],
    );

    return { flow, submit };
}
