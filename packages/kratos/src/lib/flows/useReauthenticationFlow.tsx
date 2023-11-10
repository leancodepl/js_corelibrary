import { useCallback, useEffect, useState } from "react";
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useKratosContext } from "../kratosContext";

export function useReauthenticationFlow({
    kratosClient,
    onReauthenticated,
}: {
    kratosClient: FrontendApi;
    onReauthenticated: (session: Session) => void;
}) {
    const { useHandleFlowError } = useKratosContext();

    const [flow, setFlow] = useState<LoginFlow>();

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => void setFlow(undefined), []),
    });

    useEffect(() => {
        if (flow) return;

        kratosClient
            .createBrowserLoginFlow({ refresh: true })
            .then(({ data }) => setFlow(data))
            .catch(handleFlowError);
    }, [flow, handleFlowError, kratosClient]);

    const submit = useCallback(
        (values: UpdateLoginFlowBody) => {
            if (!flow) return;

            return kratosClient
                .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: values })
                .then(({ data }) => onReauthenticated(data.session))
                .catch(handleFlowError)
                .catch((err: AxiosError<unknown>) => {
                    if (err.response?.status === 400) {
                        const flow = err?.response?.data as LoginFlow | undefined;

                        setFlow(flow);
                        return;
                    }

                    return Promise.reject(err);
                });
        },
        [flow, kratosClient, handleFlowError, onReauthenticated],
    );

    return { flow, submit };
}
