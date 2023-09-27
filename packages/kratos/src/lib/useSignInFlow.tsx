import { useCallback, useEffect, useMemo, useState } from "react";
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/kratos-client";
import { AxiosError } from "axios";
import { omit } from "lodash";
import { useLocation, useNavigate } from "react-router";
import yn from "yn";
import { UseHandleFlowError } from "./types/useHandleFlowError";
import { parseSearchParams } from "./utils/parseSearchParams";
import { aalParameterName, returnToParameterName } from "./utils/variables";

type UseSignInFlowFactoryProps = {
    useHandleFlowError: UseHandleFlowError;
};

export function signInFlowHookFactory({ useHandleFlowError }: UseSignInFlowFactoryProps) {
    return function useSignInFlow({
        kratosClient,
        signInRoute,
        onSignedIn,
        onSessionAlreadyAvailable,
    }: {
        kratosClient: FrontendApi;
        signInRoute: string;
        onSignedIn?: (session: Session) => void;
        onSessionAlreadyAvailable?: () => void;
    }) {
        const [flow, setFlow] = useState<LoginFlow>();

        const { search } = useLocation();
        const nav = useNavigate();

        const searchParams = useMemo(() => parseSearchParams(search), [search]);

        const {
            flow: flowId,
            [returnToParameterName]: returnTo,
            refresh,
            [aalParameterName]: authorizationAssuranceLevel,
        } = searchParams as Partial<Record<string, string>>;

        useEffect(() => {
            setFlow(undefined);
        }, [authorizationAssuranceLevel]);

        const handleFlowError = useHandleFlowError({
            resetFlow: useCallback(() => {
                const newParams = omit({ ...searchParams }, ["flow", aalParameterName]);

                nav(`${signInRoute}?${new URLSearchParams(newParams)}`, { replace: true });

                setFlow(undefined);
            }, [nav, searchParams, signInRoute]),
            onSessionAlreadyAvailable,
        });

        useEffect(() => {
            if (flow) return;

            if (flowId) {
                kratosClient
                    .getLoginFlow({ id: flowId })
                    .then(({ data }) => setFlow(data))
                    .catch(handleFlowError);
                return;
            }

            kratosClient
                .createBrowserLoginFlow({
                    aal: authorizationAssuranceLevel,
                    refresh: yn(refresh),
                    returnTo,
                })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError);
        }, [authorizationAssuranceLevel, flow, flowId, handleFlowError, kratosClient, refresh, returnTo]);

        const submit = useCallback(
            (values: UpdateLoginFlowBody) => {
                if (!flow) return;

                nav(`${signInRoute}?${new URLSearchParams({ ...searchParams, flow: flow.id })}`, { replace: true });

                return kratosClient
                    .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: values })
                    .then(({ data }) => {
                        if (flow.return_to) {
                            window.location.href = flow.return_to;
                            return;
                        }

                        onSignedIn?.(data.session);
                    })
                    .catch(handleFlowError)
                    .catch((err: AxiosError) => {
                        if (err.response?.status === 400) {
                            setFlow(err?.response?.data);
                            return;
                        }

                        return Promise.reject(err);
                    });
            },
            [flow, nav, signInRoute, searchParams, kratosClient, handleFlowError, onSignedIn],
        );

        return { flow, submit };
    };
}
