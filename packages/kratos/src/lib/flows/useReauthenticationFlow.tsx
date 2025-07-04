import { useCallback, useEffect, useState } from "react";
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useKratosContext } from "../kratosContext";
import { handleCancelError } from "../utils/handleCancelError";

/**
 * Manages Kratos reauthentication flow for elevated security operations.
 * 
 * Handles reauthentication flow creation and submission for operations requiring
 * fresh authentication, such as changing passwords or accessing sensitive data.
 * 
 * @param kratosClient - Configured Kratos FrontendApi client
 * @param onReauthenticated - Callback executed with session after successful reauthentication
 * @returns Object with current flow and submit function
 * @example
 * ```typescript
 * import { useReauthenticationFlow } from '@leancodepl/kratos';
 * 
 * function ReauthForm() {
 *   const { flow, submit } = useReauthenticationFlow({
 *     kratosClient,
 *     onReauthenticated: (session) => navigate('/secure-area')
 *   });
 * 
 *   return <form onSubmit={submit}>...</form>;
 * }
 * ```
 */
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

        const controller = new AbortController();

        kratosClient
            .createBrowserLoginFlow({ refresh: true }, { signal: controller.signal })
            .then(({ data }) => setFlow(data))
            .catch(handleFlowError);

        return () => {
            controller.abort();
        };
    }, [flow, handleFlowError, kratosClient]);

    const submit = useCallback(
        (values: UpdateLoginFlowBody) => {
            if (!flow) return;

            return kratosClient
                .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: values })
                .then(({ data }) => onReauthenticated(data.session))
                .catch(handleCancelError)
                .catch(handleFlowError)
                .catch((err: AxiosError<LoginFlow>) => {
                    if (err.response?.status === 400) {
                        const flow = err?.response?.data;

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
